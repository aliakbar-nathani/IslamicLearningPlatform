import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure CORS for React frontend
CORS(app, origins=["http://localhost:3000", "http://localhost:5000"], supports_credentials=True)

# Initialize Flask-RESTful API
api = Api(app)

# Import and register routes
from routes.auth import register_auth_routes
from routes.courses import register_course_routes
from routes.users import register_user_routes
from routes.progress import register_progress_routes

# Register all routes
register_auth_routes(api)
register_course_routes(api)
register_user_routes(api)
register_progress_routes(api)

# Health check endpoint
@app.route('/health')
def health_check():
    return {'status': 'healthy', 'message': 'Islamic Course API is running'}

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Resource not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
