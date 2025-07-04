# Islamic Course Platform

## Overview

This is a Flask-based RESTful API for an Islamic course platform that allows students to enroll in courses, track progress, and complete quizzes. The platform supports multiple user roles (student, instructor, admin) and provides comprehensive course management capabilities with Islamic-focused content categories.

## System Architecture

### Backend Framework
- **Flask**: Main web framework with Flask-RESTful for API endpoints
- **Architecture Pattern**: RESTful API with modular route organization
- **CORS Configuration**: Enabled for React frontend integration on localhost:3000 and localhost:5000

### Data Storage
- **Current Implementation**: In-memory storage with thread-safe operations using Python dictionaries
- **Future Migration Path**: Designed for easy MongoDB integration (storage abstraction layer in place)
- **Data Models**: Object-oriented models with UUID-based identifiers

### Authentication & Authorization
- **Session Management**: Flask sessions with secure token-based authentication
- **Password Security**: Werkzeug password hashing with strength validation
- **Role-Based Access Control**: Three user roles (student, instructor, admin) with appropriate permissions
- **Token System**: Bearer token support for API authentication

## Key Components

### User Management
- **User Registration/Login**: Email and username validation with secure password requirements
- **Profile Management**: User profiles with customizable preferences and bio information
- **Role-Based Features**: Different capabilities based on user roles

### Course Management
- **Hierarchical Structure**: Course → Sections → Subsections → Content
- **Content Types**: Videos, text, PDFs, quizzes, and assignments
- **Course Categories**: Islamic-specific categories including Quran Studies, Fiqh, Islamic History, etc.
- **Course Levels**: Beginner, Intermediate, Advanced classification

### Progress Tracking
- **Subsection Completion**: Granular tracking of user progress through course materials
- **Quiz Results**: Score tracking and passing requirements
- **Progress Calculation**: Percentage-based completion tracking

### API Endpoints
- **Authentication**: `/auth/register`, `/auth/login`, `/auth/logout`
- **Courses**: CRUD operations with filtering, pagination, and search
- **Users**: Admin-only user management endpoints
- **Progress**: Individual and instructor-viewable progress tracking

## Data Flow

1. **User Registration/Authentication**: Users register → password hashed → session/token created
2. **Course Discovery**: Users browse courses → filtered by category/level → paginated results
3. **Course Enrollment**: Users enroll → progress tracking initialized
4. **Learning Progress**: Users complete subsections → progress updated → quiz completion tracked
5. **Instructor Dashboard**: Instructors manage courses → view student progress → update content

## External Dependencies

### Python Packages
- **Flask**: Web framework and session management
- **Flask-RESTful**: API resource organization
- **Flask-CORS**: Cross-origin resource sharing for frontend integration
- **Werkzeug**: Password hashing and security utilities

### Development Tools
- **Logging**: Comprehensive logging system for debugging and monitoring
- **Error Handling**: Centralized error handling with appropriate HTTP status codes

## Deployment Strategy

### Current Configuration
- **Development Server**: Flask development server on 0.0.0.0:5000
- **Proxy Support**: ProxyFix middleware for deployment behind reverse proxies
- **Health Check**: Basic health endpoint for monitoring

### Production Considerations
- **Database Migration**: Ready for MongoDB integration through storage abstraction
- **Session Management**: Environment-based secret key configuration
- **CORS Origins**: Configurable for production domains

## User Preferences

Preferred communication style: Simple, everyday language.

## Access Control System

### Content Access Features
- **Free vs Paid Content**: Courses can be marked as free, paid, or subscription-based
- **Preview System**: First videos or specific sections can be made available as previews
- **Time-limited Previews**: Videos can have preview duration limits (e.g., first 5 minutes free)
- **Granular Control**: Access control at course, section, and subsection levels
- **Role-based Access**: Different permissions for students, instructors, and admins

### Access Control Endpoints
- **Access Check**: `/api/courses/{course_id}/access` - Check user's access level for a course
- **Subsection Access**: `/api/courses/{course_id}/subsections/{subsection_id}/access` - Get content with access control
- **Video Streaming**: `/api/videos/{subsection_id}/stream` - Get video stream with access control

## Recent Implementation (July 04, 2025)

### Completed Features
- ✅ Full Flask API backend with RESTful endpoints
- ✅ User authentication and authorization system
- ✅ Course management with CRUD operations
- ✅ Progress tracking for enrolled students
- ✅ Access control system for free/paid content
- ✅ In-memory data storage with thread-safe operations
- ✅ Islamic course categories and content structure
- ✅ Review and rating system

### API Testing Results
- All authentication endpoints working (register, login, logout)
- Course creation and management functional
- User enrollment and progress tracking operational
- Access control system implemented
- Categories and course filtering working

### Data Models Enhanced
- Course model includes access control fields (is_free, access_type, preview_config)
- Section model includes access levels and preview settings
- Subsection model includes video URLs and preview controls
- Progress tracking with granular subsection completion

## Changelog

- July 04, 2025: Complete Flask API backend implementation with access control system