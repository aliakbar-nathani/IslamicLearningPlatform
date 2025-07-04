from datetime import datetime
from typing import List, Dict, Optional
import uuid

class User:
    def __init__(self, username: str, email: str, password_hash: str, role: str = 'student'):
        self.id = str(uuid.uuid4())
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role  # 'student', 'instructor', 'admin'
        self.created_at = datetime.utcnow()
        self.profile = {
            'first_name': '',
            'last_name': '',
            'bio': '',
            'avatar_url': '',
            'preferences': {}
        }
        self.enrolled_courses = []
        self.wishlist = []

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'profile': self.profile,
            'enrolled_courses': self.enrolled_courses,
            'wishlist': self.wishlist
        }

class Course:
    def __init__(self, title: str, description: str, instructor_id: str, category: str):
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.instructor_id = instructor_id
        self.category = category
        self.level = 'Beginner'  # 'Beginner', 'Intermediate', 'Advanced'
        self.price = 0.0
        self.thumbnail_url = ''
        self.preview_video_url = ''
        self.tags = []
        self.sections = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.published = False
        self.enrolled_students = []
        self.rating = 0.0
        self.reviews = []
        self.total_duration = 0  # in minutes
        self.language = 'English'
        self.prerequisites = []
        # Access control for free/paid content
        self.is_free = False
        self.access_type = 'paid'  # 'free', 'paid', 'subscription'
        self.preview_config = {
            'free_sections': [],  # List of section IDs that are free
            'free_subsections': [],  # List of subsection IDs that are free
            'preview_duration': 300  # Default preview duration in seconds
        }

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'instructor_id': self.instructor_id,
            'category': self.category,
            'level': self.level,
            'price': self.price,
            'thumbnail_url': self.thumbnail_url,
            'preview_video_url': self.preview_video_url,
            'tags': self.tags,
            'sections': [section.to_dict() for section in self.sections],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'published': self.published,
            'enrolled_students': len(self.enrolled_students),
            'rating': self.rating,
            'reviews': self.reviews,
            'total_duration': self.total_duration,
            'language': self.language,
            'prerequisites': self.prerequisites,
            'is_free': self.is_free,
            'access_type': self.access_type,
            'preview_config': self.preview_config
        }

class Section:
    def __init__(self, title: str, description: str, course_id: str):
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.course_id = course_id
        self.order = 0
        self.subsections = []
        self.materials = []
        self.quiz_id = None
        self.created_at = datetime.utcnow()
        # Access control
        self.access_level = 'paid'  # 'free', 'paid', 'preview'
        self.is_preview = False
        self.preview_duration = None  # None means full section access

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'course_id': self.course_id,
            'order': self.order,
            'subsections': [subsection.to_dict() for subsection in self.subsections],
            'materials': self.materials,
            'quiz_id': self.quiz_id,
            'created_at': self.created_at.isoformat(),
            'access_level': self.access_level,
            'is_preview': self.is_preview,
            'preview_duration': self.preview_duration
        }

class Subsection:
    def __init__(self, title: str, content_type: str, section_id: str):
        self.id = str(uuid.uuid4())
        self.title = title
        self.content_type = content_type  # 'video', 'text', 'pdf', 'quiz'
        self.section_id = section_id
        self.order = 0
        self.content = {}  # Flexible content structure
        self.duration = 0  # in minutes
        self.created_at = datetime.utcnow()
        # Access control
        self.access_level = 'paid'  # 'free', 'paid', 'preview'
        self.is_preview = False
        self.preview_duration = None  # Seconds of free preview (None = full access)
        self.video_url = ''
        self.preview_video_url = ''  # Optional separate preview video

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content_type': self.content_type,
            'section_id': self.section_id,
            'order': self.order,
            'content': self.content,
            'duration': self.duration,
            'created_at': self.created_at.isoformat(),
            'access_level': self.access_level,
            'is_preview': self.is_preview,
            'preview_duration': self.preview_duration,
            'video_url': self.video_url,
            'preview_video_url': self.preview_video_url
        }

class Quiz:
    def __init__(self, title: str, section_id: str):
        self.id = str(uuid.uuid4())
        self.title = title
        self.section_id = section_id
        self.questions = []
        self.passing_score = 70
        self.time_limit = 30  # in minutes
        self.attempts_allowed = 3
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'section_id': self.section_id,
            'questions': self.questions,
            'passing_score': self.passing_score,
            'time_limit': self.time_limit,
            'attempts_allowed': self.attempts_allowed,
            'created_at': self.created_at.isoformat()
        }

class Progress:
    def __init__(self, user_id: str, course_id: str):
        self.id = str(uuid.uuid4())
        self.user_id = user_id
        self.course_id = course_id
        self.completed_sections = []
        self.completed_subsections = []
        self.quiz_attempts = {}
        self.current_section_id = None
        self.current_subsection_id = None
        self.progress_percentage = 0.0
        self.total_time_spent = 0  # in minutes
        self.started_at = datetime.utcnow()
        self.last_accessed = datetime.utcnow()
        self.completed_at = None

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'completed_sections': self.completed_sections,
            'completed_subsections': self.completed_subsections,
            'quiz_attempts': self.quiz_attempts,
            'current_section_id': self.current_section_id,
            'current_subsection_id': self.current_subsection_id,
            'progress_percentage': self.progress_percentage,
            'total_time_spent': self.total_time_spent,
            'started_at': self.started_at.isoformat(),
            'last_accessed': self.last_accessed.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class Review:
    def __init__(self, user_id: str, course_id: str, rating: int, comment: str):
        self.id = str(uuid.uuid4())
        self.user_id = user_id
        self.course_id = course_id
        self.rating = rating
        self.comment = comment
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat()
        }
