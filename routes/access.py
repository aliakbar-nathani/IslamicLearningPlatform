from flask import request, jsonify, session
from flask_restful import Resource, Api
from data.storage import storage
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

class CourseAccessCheckResource(Resource):
    def get(self, course_id):
        """Check user's access level for a course"""
        try:
            current_user = get_current_user()
            course = storage.get_course(course_id)
            
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Default access for unauthenticated users
            if not current_user:
                return {
                    'has_full_access': False,
                    'access_type': 'guest',
                    'can_access_previews': True,
                    'accessible_sections': course.preview_config.get('free_sections', []),
                    'accessible_subsections': course.preview_config.get('free_subsections', []),
                    'preview_duration': course.preview_config.get('preview_duration', 300)
                }, 200
            
            # Check if user is enrolled or has purchased the course
            has_full_access = current_user.id in course.enrolled_students
            
            # Instructor and admin always have full access
            if current_user.role in ['admin', 'instructor']:
                has_full_access = True
            
            # If course is free, everyone has access
            if course.is_free or course.access_type == 'free':
                has_full_access = True
            
            access_info = {
                'has_full_access': has_full_access,
                'access_type': 'full' if has_full_access else 'preview',
                'can_access_previews': True,
                'user_role': current_user.role,
                'is_enrolled': current_user.id in course.enrolled_students
            }
            
            if not has_full_access:
                # Return preview access information
                access_info.update({
                    'accessible_sections': course.preview_config.get('free_sections', []),
                    'accessible_subsections': course.preview_config.get('free_subsections', []),
                    'preview_duration': course.preview_config.get('preview_duration', 300)
                })
            
            return access_info, 200
            
        except Exception as e:
            logger.error(f"Access check error: {str(e)}")
            return {'error': 'Failed to check access'}, 500

class SubsectionAccessResource(Resource):
    def get(self, course_id, subsection_id):
        """Check access to a specific subsection and return appropriate content"""
        try:
            current_user = get_current_user()
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            subsection = storage.get_subsection(subsection_id)
            if not subsection:
                return {'error': 'Subsection not found'}, 404
            
            # Check if user has full access
            has_full_access = False
            if current_user:
                has_full_access = (
                    current_user.id in course.enrolled_students or
                    current_user.role in ['admin', 'instructor'] or
                    course.is_free or
                    course.access_type == 'free'
                )
            
            # Determine what content to return
            subsection_data = subsection.to_dict()
            
            if has_full_access:
                # Return full content
                subsection_data['can_access'] = True
                subsection_data['access_type'] = 'full'
            else:
                # Check if this subsection is in free previews
                is_free_subsection = subsection.id in course.preview_config.get('free_subsections', [])
                is_preview_section = subsection.access_level == 'free' or subsection.is_preview
                
                if is_free_subsection or is_preview_section:
                    subsection_data['can_access'] = True
                    subsection_data['access_type'] = 'preview'
                    
                    # Apply preview duration limits
                    if subsection.preview_duration:
                        subsection_data['available_duration'] = subsection.preview_duration
                    elif course.preview_config.get('preview_duration'):
                        subsection_data['available_duration'] = course.preview_config['preview_duration']
                    
                    # Use preview video if available
                    if subsection.preview_video_url:
                        subsection_data['video_url'] = subsection.preview_video_url
                else:
                    # No access - return limited info
                    subsection_data['can_access'] = False
                    subsection_data['access_type'] = 'locked'
                    subsection_data['video_url'] = ''
                    subsection_data['content'] = {}
                    subsection_data['message'] = 'Enroll in the course to access this content'
            
            return {'subsection': subsection_data}, 200
            
        except Exception as e:
            logger.error(f"Subsection access error: {str(e)}")
            return {'error': 'Failed to check subsection access'}, 500

class VideoStreamResource(Resource):
    def get(self, subsection_id):
        """Get video stream URL with access control"""
        try:
            current_user = get_current_user()
            
            subsection = storage.get_subsection(subsection_id)
            if not subsection:
                return {'error': 'Subsection not found'}, 404
            
            # Get section and course info
            section = storage.get_section(subsection.section_id)
            if not section:
                return {'error': 'Section not found'}, 404
                
            course = storage.get_course(section.course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check access
            has_full_access = False
            if current_user:
                has_full_access = (
                    current_user.id in course.enrolled_students or
                    current_user.role in ['admin', 'instructor'] or
                    course.is_free or
                    course.access_type == 'free'
                )
            
            video_data = {
                'subsection_id': subsection.id,
                'title': subsection.title,
                'duration': subsection.duration
            }
            
            if has_full_access:
                # Full access - return complete video
                video_data.update({
                    'video_url': subsection.video_url,
                    'access_type': 'full',
                    'available_duration': subsection.duration * 60  # Convert to seconds
                })
            else:
                # Check preview access
                is_preview_available = (
                    subsection.id in course.preview_config.get('free_subsections', []) or
                    subsection.access_level == 'free' or
                    subsection.is_preview
                )
                
                if is_preview_available:
                    # Preview access
                    preview_duration = (
                        subsection.preview_duration or 
                        course.preview_config.get('preview_duration', 300)
                    )
                    
                    video_data.update({
                        'video_url': subsection.preview_video_url or subsection.video_url,
                        'access_type': 'preview',
                        'available_duration': preview_duration,
                        'message': f'Preview available for {preview_duration} seconds. Enroll for full access.'
                    })
                else:
                    # No access
                    return {'error': 'Access denied. Please enroll in the course.'}, 403
            
            return video_data, 200
            
        except Exception as e:
            logger.error(f"Video stream error: {str(e)}")
            return {'error': 'Failed to get video stream'}, 500

def register_access_routes(api: Api):
    """Register access control routes"""
    api.add_resource(CourseAccessCheckResource, '/api/courses/<string:course_id>/access')
    api.add_resource(SubsectionAccessResource, '/api/courses/<string:course_id>/subsections/<string:subsection_id>/access')
    api.add_resource(VideoStreamResource, '/api/videos/<string:subsection_id>/stream')