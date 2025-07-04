from flask import request, jsonify, session
from flask_restful import Resource, Api
from data.storage import storage
from models import Progress
from utils.helpers import calculate_progress_percentage
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def get_current_user():
    """Get current authenticated user"""
    user_id = session.get('user_id')
    if not user_id:
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:]
            user = storage.get_user_by_token(token)
            return user
    else:
        return storage.get_user(user_id)
    return None

class ProgressResource(Resource):
    def get(self, user_id, course_id):
        """Get user's progress for a specific course"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only view their own progress or instructors/admins can view their students'
            if current_user.role not in ['admin', 'instructor'] and current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            # If instructor, verify they teach this course
            if current_user.role == 'instructor':
                course = storage.get_course(course_id)
                if not course or course.instructor_id != current_user.id:
                    return {'error': 'Insufficient permissions'}, 403
            
            progress = storage.get_progress(user_id, course_id)
            if not progress:
                return {'error': 'Progress not found'}, 404
            
            # Get course details to calculate total subsections
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Calculate total subsections
            total_subsections = 0
            for section in course.sections:
                total_subsections += len(section.subsections)
            
            # Update progress percentage
            progress.progress_percentage = calculate_progress_percentage(
                progress.completed_subsections, total_subsections
            )
            
            progress_data = progress.to_dict()
            progress_data['total_subsections'] = total_subsections
            
            return {'progress': progress_data}, 200
            
        except Exception as e:
            logger.error(f"Progress fetch error: {str(e)}")
            return {'error': 'Failed to fetch progress'}, 500
    
    def put(self, user_id, course_id):
        """Update user's progress"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only update their own progress
            if current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            progress = storage.get_progress(user_id, course_id)
            if not progress:
                return {'error': 'Progress not found'}, 404
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Update progress
            updates = {}
            
            if 'completed_sections' in data:
                updates['completed_sections'] = data['completed_sections']
            
            if 'completed_subsections' in data:
                updates['completed_subsections'] = data['completed_subsections']
            
            if 'current_section_id' in data:
                updates['current_section_id'] = data['current_section_id']
            
            if 'current_subsection_id' in data:
                updates['current_subsection_id'] = data['current_subsection_id']
            
            if 'total_time_spent' in data:
                updates['total_time_spent'] = int(data['total_time_spent'])
            
            # Always update last accessed time
            updates['last_accessed'] = datetime.utcnow()
            
            # Calculate progress percentage
            if 'completed_subsections' in updates:
                course = storage.get_course(course_id)
                if course:
                    total_subsections = sum(len(section.subsections) for section in course.sections)
                    updates['progress_percentage'] = calculate_progress_percentage(
                        updates['completed_subsections'], total_subsections
                    )
                    
                    # Check if course is completed
                    if updates['progress_percentage'] >= 100:
                        updates['completed_at'] = datetime.utcnow()
            
            updated_progress = storage.update_progress(progress.id, updates)
            if not updated_progress:
                return {'error': 'Failed to update progress'}, 500
            
            logger.info(f"Progress updated for user {user_id} in course {course_id}")
            
            return {
                'message': 'Progress updated successfully',
                'progress': updated_progress.to_dict()
            }, 200
            
        except Exception as e:
            logger.error(f"Progress update error: {str(e)}")
            return {'error': 'Failed to update progress'}, 500

class SectionProgressResource(Resource):
    def post(self, user_id, course_id, section_id):
        """Mark a section as completed"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only update their own progress
            if current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            progress = storage.get_progress(user_id, course_id)
            if not progress:
                return {'error': 'Progress not found'}, 404
            
            # Verify section exists
            section = storage.get_section(section_id)
            if not section or section.course_id != course_id:
                return {'error': 'Section not found'}, 404
            
            # Mark section as completed
            if section_id not in progress.completed_sections:
                progress.completed_sections.append(section_id)
                
                # Also mark all subsections in this section as completed
                for subsection in section.subsections:
                    if subsection.id not in progress.completed_subsections:
                        progress.completed_subsections.append(subsection.id)
                
                # Update progress
                course = storage.get_course(course_id)
                if course:
                    total_subsections = sum(len(s.subsections) for s in course.sections)
                    progress.progress_percentage = calculate_progress_percentage(
                        progress.completed_subsections, total_subsections
                    )
                    
                    if progress.progress_percentage >= 100:
                        progress.completed_at = datetime.utcnow()
                
                progress.last_accessed = datetime.utcnow()
                
                logger.info(f"Section {section_id} completed by user {user_id}")
            
            return {
                'message': 'Section marked as completed',
                'progress': progress.to_dict()
            }, 200
            
        except Exception as e:
            logger.error(f"Section completion error: {str(e)}")
            return {'error': 'Failed to mark section as completed'}, 500

class SubsectionProgressResource(Resource):
    def post(self, user_id, course_id, subsection_id):
        """Mark a subsection as completed"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only update their own progress
            if current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            progress = storage.get_progress(user_id, course_id)
            if not progress:
                return {'error': 'Progress not found'}, 404
            
            # Verify subsection exists
            subsection = storage.get_subsection(subsection_id)
            if not subsection:
                return {'error': 'Subsection not found'}, 404
            
            # Verify subsection belongs to course
            section = storage.get_section(subsection.section_id)
            if not section or section.course_id != course_id:
                return {'error': 'Subsection not found in this course'}, 404
            
            # Mark subsection as completed
            if subsection_id not in progress.completed_subsections:
                progress.completed_subsections.append(subsection_id)
                
                # Update current position
                progress.current_subsection_id = subsection_id
                progress.current_section_id = subsection.section_id
                
                # Check if entire section is completed
                section_completed = all(
                    sub.id in progress.completed_subsections 
                    for sub in section.subsections
                )
                
                if section_completed and section.id not in progress.completed_sections:
                    progress.completed_sections.append(section.id)
                
                # Update progress percentage
                course = storage.get_course(course_id)
                if course:
                    total_subsections = sum(len(s.subsections) for s in course.sections)
                    progress.progress_percentage = calculate_progress_percentage(
                        progress.completed_subsections, total_subsections
                    )
                    
                    if progress.progress_percentage >= 100:
                        progress.completed_at = datetime.utcnow()
                
                progress.last_accessed = datetime.utcnow()
                
                logger.info(f"Subsection {subsection_id} completed by user {user_id}")
            
            return {
                'message': 'Subsection marked as completed',
                'progress': progress.to_dict()
            }, 200
            
        except Exception as e:
            logger.error(f"Subsection completion error: {str(e)}")
            return {'error': 'Failed to mark subsection as completed'}, 500

class QuizAttemptResource(Resource):
    def post(self, user_id, course_id, quiz_id):
        """Record a quiz attempt"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only update their own progress
            if current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            progress = storage.get_progress(user_id, course_id)
            if not progress:
                return {'error': 'Progress not found'}, 404
            
            quiz = storage.get_quiz(quiz_id)
            if not quiz:
                return {'error': 'Quiz not found'}, 404
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate quiz attempt data
            if 'score' not in data or 'answers' not in data:
                return {'error': 'Score and answers are required'}, 400
            
            try:
                score = int(data['score'])
                if score < 0 or score > 100:
                    return {'error': 'Score must be between 0 and 100'}, 400
            except ValueError:
                return {'error': 'Invalid score value'}, 400
            
            # Record quiz attempt
            attempt_data = {
                'score': score,
                'answers': data['answers'],
                'timestamp': datetime.utcnow().isoformat(),
                'passed': score >= quiz.passing_score
            }
            
            if quiz_id not in progress.quiz_attempts:
                progress.quiz_attempts[quiz_id] = []
            
            progress.quiz_attempts[quiz_id].append(attempt_data)
            progress.last_accessed = datetime.utcnow()
            
            logger.info(f"Quiz attempt recorded: quiz {quiz_id} by user {user_id}, score: {score}")
            
            return {
                'message': 'Quiz attempt recorded',
                'attempt': attempt_data,
                'progress': progress.to_dict()
            }, 200
            
        except Exception as e:
            logger.error(f"Quiz attempt error: {str(e)}")
            return {'error': 'Failed to record quiz attempt'}, 500

class UserProgressListResource(Resource):
    def get(self, user_id):
        """Get all progress for a user"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only view their own progress or admins can view any
            if current_user.role != 'admin' and current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            user_progress = storage.get_user_progress(user_id)
            
            # Enrich progress data with course information
            progress_data = []
            for progress in user_progress:
                progress_dict = progress.to_dict()
                
                # Add course information
                course = storage.get_course(progress.course_id)
                if course:
                    progress_dict['course'] = {
                        'id': course.id,
                        'title': course.title,
                        'category': course.category,
                        'thumbnail_url': course.thumbnail_url
                    }
                
                progress_data.append(progress_dict)
            
            return {'progress': progress_data}, 200
            
        except Exception as e:
            logger.error(f"User progress fetch error: {str(e)}")
            return {'error': 'Failed to fetch user progress'}, 500

def register_progress_routes(api: Api):
    """Register progress routes"""
    api.add_resource(ProgressResource, '/api/progress/<string:user_id>/<string:course_id>')
    api.add_resource(SectionProgressResource, '/api/progress/<string:user_id>/<string:course_id>/sections/<string:section_id>/complete')
    api.add_resource(SubsectionProgressResource, '/api/progress/<string:user_id>/<string:course_id>/subsections/<string:subsection_id>/complete')
    api.add_resource(QuizAttemptResource, '/api/progress/<string:user_id>/<string:course_id>/quizzes/<string:quiz_id>/attempt')
    api.add_resource(UserProgressListResource, '/api/progress/<string:user_id>')
