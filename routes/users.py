from flask import request, jsonify, session
from flask_restful import Resource, Api
from data.storage import storage
from utils.helpers import paginate_results
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

class UsersResource(Resource):
    def get(self):
        """Get users (admin only)"""
        try:
            user = get_current_user()
            if not user:
                return {'error': 'Authentication required'}, 401
            
            if user.role != 'admin':
                return {'error': 'Insufficient permissions'}, 403
            
            # Get query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            role = request.args.get('role')
            
            # Get all users
            users = list(storage.users.values())
            
            # Filter by role if specified
            if role:
                users = [u for u in users if u.role == role]
            
            # Convert to dict
            users_data = [user.to_dict() for user in users]
            
            # Paginate results
            paginated = paginate_results(users_data, page, per_page)
            
            return {
                'users': paginated['items'],
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
            logger.error(f"Users fetch error: {str(e)}")
            return {'error': 'Failed to fetch users'}, 500

class UserResource(Resource):
    def get(self, user_id):
        """Get specific user details"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only view their own profile or admins can view any
            if current_user.role != 'admin' and current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            user_data = user.to_dict()
            
            # If it's the user's own profile or admin, include sensitive info
            if current_user.id == user_id or current_user.role == 'admin':
                # Get user's progress
                user_progress = storage.get_user_progress(user_id)
                user_data['progress'] = [progress.to_dict() for progress in user_progress]
                
                # Get enrolled courses details
                enrolled_courses = []
                for course_id in user.enrolled_courses:
                    course = storage.get_course(course_id)
                    if course:
                        enrolled_courses.append({
                            'id': course.id,
                            'title': course.title,
                            'category': course.category,
                            'thumbnail_url': course.thumbnail_url
                        })
                user_data['enrolled_courses_details'] = enrolled_courses
            
            return {'user': user_data}, 200
            
        except Exception as e:
            logger.error(f"User fetch error: {str(e)}")
            return {'error': 'Failed to fetch user'}, 500
    
    def put(self, user_id):
        """Update user"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only update their own profile or admins can update any
            if current_user.role != 'admin' and current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Update user
            updates = {}
            updatable_fields = ['username', 'email', 'profile']
            
            # Admin can update role
            if current_user.role == 'admin':
                updatable_fields.append('role')
            
            for field in updatable_fields:
                if field in data:
                    updates[field] = data[field]
            
            updated_user = storage.update_user(user_id, updates)
            if not updated_user:
                return {'error': 'Failed to update user'}, 500
            
            logger.info(f"User updated: {user.username} by {current_user.username}")
            
            return {
                'message': 'User updated successfully',
                'user': updated_user.to_dict()
            }, 200
            
        except Exception as e:
            logger.error(f"User update error: {str(e)}")
            return {'error': 'Failed to update user'}, 500
    
    def delete(self, user_id):
        """Delete user (admin only)"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            if current_user.role != 'admin':
                return {'error': 'Insufficient permissions'}, 403
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            # Cannot delete self
            if current_user.id == user_id:
                return {'error': 'Cannot delete your own account'}, 400
            
            # Delete user
            if storage.delete_user(user_id):
                logger.info(f"User deleted: {user.username} by {current_user.username}")
                return {'message': 'User deleted successfully'}, 200
            else:
                return {'error': 'Failed to delete user'}, 500
                
        except Exception as e:
            logger.error(f"User deletion error: {str(e)}")
            return {'error': 'Failed to delete user'}, 500

class UserCoursesResource(Resource):
    def get(self, user_id):
        """Get user's courses"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only view their own courses or admins can view any
            if current_user.role != 'admin' and current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            # Get enrolled courses
            enrolled_courses = []
            for course_id in user.enrolled_courses:
                course = storage.get_course(course_id)
                if course:
                    course_data = course.to_dict()
                    
                    # Get user's progress for this course
                    progress = storage.get_progress(user_id, course_id)
                    if progress:
                        course_data['progress'] = progress.to_dict()
                    
                    enrolled_courses.append(course_data)
            
            # Get wishlist courses
            wishlist_courses = []
            for course_id in user.wishlist:
                course = storage.get_course(course_id)
                if course:
                    wishlist_courses.append(course.to_dict())
            
            return {
                'enrolled_courses': enrolled_courses,
                'wishlist_courses': wishlist_courses
            }, 200
            
        except Exception as e:
            logger.error(f"User courses fetch error: {str(e)}")
            return {'error': 'Failed to fetch user courses'}, 500

class UserWishlistResource(Resource):
    def post(self, user_id, course_id):
        """Add course to wishlist"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only modify their own wishlist
            if current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            course = storage.get_course(course_id)
            if not course:
                return {'error': 'Course not found'}, 404
            
            # Check if already in wishlist
            if course_id in user.wishlist:
                return {'error': 'Course already in wishlist'}, 400
            
            # Add to wishlist
            user.wishlist.append(course_id)
            
            logger.info(f"Course added to wishlist: {course.title} by {user.username}")
            
            return {'message': 'Course added to wishlist'}, 200
            
        except Exception as e:
            logger.error(f"Wishlist add error: {str(e)}")
            return {'error': 'Failed to add to wishlist'}, 500
    
    def delete(self, user_id, course_id):
        """Remove course from wishlist"""
        try:
            current_user = get_current_user()
            if not current_user:
                return {'error': 'Authentication required'}, 401
            
            # Users can only modify their own wishlist
            if current_user.id != user_id:
                return {'error': 'Insufficient permissions'}, 403
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            # Check if in wishlist
            if course_id not in user.wishlist:
                return {'error': 'Course not in wishlist'}, 400
            
            # Remove from wishlist
            user.wishlist.remove(course_id)
            
            logger.info(f"Course removed from wishlist: {course_id} by {user.username}")
            
            return {'message': 'Course removed from wishlist'}, 200
            
        except Exception as e:
            logger.error(f"Wishlist remove error: {str(e)}")
            return {'error': 'Failed to remove from wishlist'}, 500

def register_user_routes(api: Api):
    """Register user routes"""
    api.add_resource(UsersResource, '/api/users')
    api.add_resource(UserResource, '/api/users/<string:user_id>')
    api.add_resource(UserCoursesResource, '/api/users/<string:user_id>/courses')
    api.add_resource(UserWishlistResource, '/api/users/<string:user_id>/wishlist/<string:course_id>')
