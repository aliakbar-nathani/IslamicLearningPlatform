from flask import request, jsonify, session
from flask_restful import Resource, Api
from werkzeug.security import generate_password_hash, check_password_hash
from data.storage import storage
from models import User
from utils.validators import validate_email, validate_password
from utils.helpers import generate_token, hash_password, verify_password
import logging

logger = logging.getLogger(__name__)

class RegisterResource(Resource):
    def post(self):
        """Register a new user"""
        try:
            data = request.get_json()
            
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate required fields
            required_fields = ['username', 'email', 'password']
            for field in required_fields:
                if field not in data or not data[field]:
                    return {'error': f'{field} is required'}, 400
            
            # Validate email format
            if not validate_email(data['email']):
                return {'error': 'Invalid email format'}, 400
            
            # Validate password strength
            password_validation = validate_password(data['password'])
            if not password_validation['valid']:
                return {'error': 'Password validation failed', 'details': password_validation['errors']}, 400
            
            # Check if user already exists
            if storage.get_user_by_email(data['email']):
                return {'error': 'User with this email already exists'}, 409
            
            if storage.get_user_by_username(data['username']):
                return {'error': 'Username already taken'}, 409
            
            # Create new user
            password_hash = hash_password(data['password'])
            user = User(
                username=data['username'],
                email=data['email'],
                password_hash=password_hash,
                role=data.get('role', 'student')
            )
            
            # Save user
            storage.create_user(user)
            
            logger.info(f"New user registered: {user.username}")
            
            return {
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            }, 201
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return {'error': 'Registration failed'}, 500

class LoginResource(Resource):
    def post(self):
        """Login user"""
        try:
            data = request.get_json()
            
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate required fields
            if 'email' not in data or 'password' not in data:
                return {'error': 'Email and password are required'}, 400
            
            # Find user
            user = storage.get_user_by_email(data['email'])
            if not user:
                return {'error': 'Invalid credentials'}, 401
            
            # Verify password
            if not verify_password(data['password'], user.password_hash):
                return {'error': 'Invalid credentials'}, 401
            
            # Generate session token
            token = generate_token()
            storage.create_session(token, user.id)
            
            # Set session
            session['user_id'] = user.id
            session['token'] = token
            
            logger.info(f"User logged in: {user.username}")
            
            return {
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            }, 200
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return {'error': 'Login failed'}, 500

class LogoutResource(Resource):
    def post(self):
        """Logout user"""
        try:
            token = request.headers.get('Authorization')
            if token and token.startswith('Bearer '):
                token = token[7:]  # Remove 'Bearer ' prefix
                storage.delete_session(token)
            
            # Clear session
            session.clear()
            
            return {'message': 'Logged out successfully'}, 200
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return {'error': 'Logout failed'}, 500

class ProfileResource(Resource):
    def get(self):
        """Get current user profile"""
        try:
            # Get user from session or token
            user_id = session.get('user_id')
            if not user_id:
                token = request.headers.get('Authorization')
                if token and token.startswith('Bearer '):
                    token = token[7:]
                    user = storage.get_user_by_token(token)
                    if user:
                        user_id = user.id
            
            if not user_id:
                return {'error': 'Authentication required'}, 401
            
            user = storage.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            return {'user': user.to_dict()}, 200
            
        except Exception as e:
            logger.error(f"Profile fetch error: {str(e)}")
            return {'error': 'Failed to fetch profile'}, 500
    
    def put(self):
        """Update user profile"""
        try:
            # Get user from session or token
            user_id = session.get('user_id')
            if not user_id:
                token = request.headers.get('Authorization')
                if token and token.startswith('Bearer '):
                    token = token[7:]
                    user = storage.get_user_by_token(token)
                    if user:
                        user_id = user.id
            
            if not user_id:
                return {'error': 'Authentication required'}, 401
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Update profile
            updates = {}
            if 'profile' in data:
                updates['profile'] = data['profile']
            
            user = storage.update_user(user_id, updates)
            if not user:
                return {'error': 'User not found'}, 404
            
            return {'message': 'Profile updated successfully', 'user': user.to_dict()}, 200
            
        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            return {'error': 'Failed to update profile'}, 500

def register_auth_routes(api: Api):
    """Register authentication routes"""
    api.add_resource(RegisterResource, '/api/auth/register')
    api.add_resource(LoginResource, '/api/auth/login')
    api.add_resource(LogoutResource, '/api/auth/logout')
    api.add_resource(ProfileResource, '/api/auth/profile')
