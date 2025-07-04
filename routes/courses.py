from flask import request, jsonify, session
from flask_restful import Resource, Api
from data.storage import storage
from models import Course, Section, Subsection, Quiz, Review
from utils.validators import validate_course_data, validate_section_data, validate_subsection_data, validate_quiz_data
from utils.helpers import paginate_results, get_course_statistics, sanitize_search_query, generate_course_slug
from config import Config
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

class CoursesResource(Resource):
    def get(self):
        """Get courses with filtering and pagination"""
        try:
            # Get query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            category = request.args.get('category')
            level = request.args.get('level')
            search = request.args.get('search')
            published_only = request.args.get('published', 'true').lower() == 'true'
            
            # Build filters
            filters = {}
            if category:
                filters['category'] = category
            if level:
                filters['level'] = level
            if search:
                filters['search'] = sanitize_search_query(search)
            if published_only:
                filters['published'] = True
            
            # Get courses
            courses = storage.get_courses(filters)
            
            # Convert to dict and add statistics
            courses_data = []
            for course in courses:
                course_dict = course.to_dict()
                course_dict['statistics'] = get_course_statistics(course, storage)
                courses_data.append(course_dict)
            
            # Paginate results
            paginated = paginate_results(courses_data, page, per_page)
            
            return {
                'courses': paginated['items'],
                'pagination': {
                    'page': paginated['page'],
                    'per_page': paginated['per_page'],
                    'total': paginated['total'],
                    'pages': paginated['pages'],
                    'has_prev': paginated['has_prev'],
                    'has_next': paginated['has_next']
                }
            }, 200
            
        except Exception as e:
            logger.error(f"Courses fetch error: {str(e)}")
            return {'error': 'Failed to fetch courses'}, 500
    
    def post(self):
        """Create a new course"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            if user.role not in ['instructor', 'admin']:
                return {'error': 'Insufficient permissions'}, 403
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate course data
            validation = validate_course_data(data)
            if not validation['valid']:
                return {'error': 'Validation failed', 'details': validation['errors']}, 400
            
            # Create course
            course = Course(
                title=data['title'],
                description=data['description'],
                instructor_id=user.id,
                category=data['category']
            )
            
            # Set optional fields
            if 'level' in data:
                course.level = data['level']
            if 'price' in data:
                course.price = float(data['price'])
            if 'thumbnail_url' in data:
                course.thumbnail_url = data['thumbnail_url']
            if 'preview_video_url' in data:
                course.preview_video_url = data['preview_video_url']
            if 'tags' in data:
                course.tags = data['tags']
            if 'language' in data:
                course.language = data['language']
            if 'prerequisites' in data:
                course.prerequisites = data['prerequisites']
            
            # Save course
            storage.create_course(course)
            
            logger.info(f"New course created: {course.title} by {user.username}")
            
            return {
                'message': 'Course created successfully',
                'course': course.to_dict()
            }, 201
            
        except Exception as e:
            logger.error(f"Course creation error: {str(e)}")
            return {'error': 'Failed to create course'}, 500

class CourseResource(Resource):
    def get(self, course_id):
        """Get specific course details"""
        try:
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Get course with statistics
            course_dict = course.to_dict()
            course_dict['statistics'] = get_course_statistics(course, storage)
            
            # Get reviews
            reviews = storage.get_reviews_by_course(course_id)
            course_dict['reviews'] = [review.to_dict() for review in reviews]
            
            return {'course': course_dict}, 200
            
        except Exception as e:
            logger.error(f"Course fetch error: {str(e)}")
            return {'error': 'Failed to fetch course'}, 500
    
    def put(self, course_id):
        """Update course"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check permissions
            if user.role != 'admin' and course.instructor_id != user.id:
                return {'error': 'Insufficient permissions'}, 403
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Update course
            updates = {}
            updatable_fields = ['title', 'description', 'category', 'level', 'price', 
                              'thumbnail_url', 'preview_video_url', 'tags', 'language', 
                              'prerequisites', 'published']
            
            for field in updatable_fields:
                if field in data:
                    updates[field] = data[field]
            
            updated_course = storage.update_course(course_id, updates)
            if not updated_course:
                return {'error': 'Failed to update course'}, 500
            
            logger.info(f"Course updated: {course.title} by {user.username}")
            
            return {
                'message': 'Course updated successfully',
                'course': updated_course.to_dict()
            }, 200
            
        except Exception as e:
            logger.error(f"Course update error: {str(e)}")
            return {'error': 'Failed to update course'}, 500
    
    def delete(self, course_id):
        """Delete course"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check permissions
            if user.role != 'admin' and course.instructor_id != user.id:
                return {'error': 'Insufficient permissions'}, 403
            
            # Delete course
            if storage.delete_course(course_id):
                logger.info(f"Course deleted: {course.title} by {user.username}")
                return {'message': 'Course deleted successfully'}, 200
            else:
                return {'error': 'Failed to delete course'}, 500
                
        except Exception as e:
            logger.error(f"Course deletion error: {str(e)}")
            return {'error': 'Failed to delete course'}, 500

class CourseEnrollmentResource(Resource):
    def post(self, course_id):
        """Enroll in a course"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check if already enrolled
            if user.id in course.enrolled_students:
                return {'error': 'Already enrolled in this course'}, 400
            
            # Enroll user
            course.enrolled_students.append(user.id)
            user.enrolled_courses.append(course_id)
            
            # Create initial progress
            from models import Progress
            progress = Progress(user.id, course_id)
            storage.create_progress(progress)
            
            logger.info(f"User enrolled: {user.username} in {course.title}")
            
            return {'message': 'Enrolled successfully'}, 200
            
        except Exception as e:
            logger.error(f"Enrollment error: {str(e)}")
            return {'error': 'Failed to enroll'}, 500
    
    def delete(self, course_id):
        """Unenroll from a course"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check if enrolled
            if user.id not in course.enrolled_students:
                return {'error': 'Not enrolled in this course'}, 400
            
            # Unenroll user
            course.enrolled_students.remove(user.id)
            user.enrolled_courses.remove(course_id)
            
            logger.info(f"User unenrolled: {user.username} from {course.title}")
            
            return {'message': 'Unenrolled successfully'}, 200
            
        except Exception as e:
            logger.error(f"Unenrollment error: {str(e)}")
            return {'error': 'Failed to unenroll'}, 500

class CourseSectionsResource(Resource):
    def get(self, course_id):
        """Get course sections"""
        try:
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            sections = storage.get_sections_by_course(course_id)
            sections_data = [section.to_dict() for section in sections]
            
            return {'sections': sections_data}, 200
            
        except Exception as e:
            logger.error(f"Sections fetch error: {str(e)}")
            return {'error': 'Failed to fetch sections'}, 500
    
    def post(self, course_id):
        """Create a new section"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check permissions
            if user.role != 'admin' and course.instructor_id != user.id:
                return {'error': 'Insufficient permissions'}, 403
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate section data
            data['course_id'] = course_id
            validation = validate_section_data(data)
            if not validation['valid']:
                return {'error': 'Validation failed', 'details': validation['errors']}, 400
            
            # Create section
            section = Section(
                title=data['title'],
                description=data.get('description', ''),
                course_id=course_id
            )
            
            if 'order' in data:
                section.order = int(data['order'])
            
            storage.create_section(section)
            
            logger.info(f"New section created: {section.title} in {course.title}")
            
            return {
                'message': 'Section created successfully',
                'section': section.to_dict()
            }, 201
            
        except Exception as e:
            logger.error(f"Section creation error: {str(e)}")
            return {'error': 'Failed to create section'}, 500

class CourseCategoriesResource(Resource):
    def get(self):
        """Get available course categories"""
        try:
            return {'categories': Config.COURSE_CATEGORIES}, 200
        except Exception as e:
            logger.error(f"Categories fetch error: {str(e)}")
            return {'error': 'Failed to fetch categories'}, 500

class CourseReviewsResource(Resource):
    def get(self, course_id):
        """Get course reviews"""
        try:
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            reviews = storage.get_reviews_by_course(course_id)
            reviews_data = []
            
            for review in reviews:
                review_dict = review.to_dict()
                # Get reviewer info
                reviewer = storage.get_user(review.user_id)
                if reviewer:
                    review_dict['reviewer'] = {
                        'username': reviewer.username,
                        'profile': reviewer.profile
                    }
                reviews_data.append(review_dict)
            
            return {'reviews': reviews_data}, 200
            
        except Exception as e:
            logger.error(f"Reviews fetch error: {str(e)}")
            return {'error': 'Failed to fetch reviews'}, 500
    
    def post(self, course_id):
        """Create a course review"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check if user is enrolled
            if user.id not in course.enrolled_students:
                return {'error': 'You must be enrolled to leave a review'}, 400
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate required fields
            if 'rating' not in data or 'comment' not in data:
                return {'error': 'Rating and comment are required'}, 400
            
            try:
                rating = int(data['rating'])
                if rating < 1 or rating > 5:
                    return {'error': 'Rating must be between 1 and 5'}, 400
            except ValueError:
                return {'error': 'Invalid rating value'}, 400
            
            # Create review
            review = Review(
                user_id=user.id,
                course_id=course_id,
                rating=rating,
                comment=data['comment']
            )
            
            storage.create_review(review)
            
            logger.info(f"New review created for {course.title} by {user.username}")
            
            return {
                'message': 'Review created successfully',
                'review': review.to_dict()
            }, 201
            
        except Exception as e:
            logger.error(f"Review creation error: {str(e)}")
            return {'error': 'Failed to create review'}, 500

def register_course_routes(api: Api):
    """Register course routes"""
    api.add_resource(CoursesResource, '/api/courses')
    api.add_resource(CourseResource, '/api/courses/<string:course_id>')
    api.add_resource(CourseEnrollmentResource, '/api/courses/<string:course_id>/enroll')
    api.add_resource(CourseSectionsResource, '/api/courses/<string:course_id>/sections')
    api.add_resource(CourseCategoriesResource, '/api/courses/categories')
    api.add_resource(CourseReviewsResource, '/api/courses/<string:course_id>/reviews')
