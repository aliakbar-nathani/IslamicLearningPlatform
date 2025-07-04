import os

class Config:
    SECRET_KEY = os.environ.get('SESSION_SECRET', 'dev-secret-key-change-in-production')
    DEBUG = True
    
    # Islamic course categories
    COURSE_CATEGORIES = [
        'Quran Studies',
        'Fiqh & Jurisprudence',
        'Islamic History',
        'Hadith & Sunnah',
        'Arabic Language',
        'Theology & Philosophy',
        'Islamic Ethics',
        'Spirituality & Sufism',
        'Comparative Religion',
        'Islamic Finance'
    ]
    
    # Content types supported
    CONTENT_TYPES = [
        'video',
        'text',
        'pdf',
        'quiz',
        'assignment'
    ]
    
    # User roles
    USER_ROLES = [
        'student',
        'instructor',
        'admin'
    ]
    
    # Course levels
    COURSE_LEVELS = [
        'Beginner',
        'Intermediate',
        'Advanced'
    ]
