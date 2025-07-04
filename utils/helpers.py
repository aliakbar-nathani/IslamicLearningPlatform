import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from werkzeug.security import generate_password_hash, check_password_hash

def generate_token() -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)

def hash_password(password: str) -> str:
    """Hash a password using Werkzeug's secure method"""
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash"""
    return check_password_hash(password_hash, password)

def calculate_progress_percentage(completed_subsections: list, total_subsections: int) -> float:
    """Calculate progress percentage"""
    if total_subsections == 0:
        return 0.0
    return (len(completed_subsections) / total_subsections) * 100

def format_duration(minutes: int) -> str:
    """Format duration in minutes to human readable format"""
    if minutes < 60:
        return f"{minutes} min"
    
    hours = minutes // 60
    remaining_minutes = minutes % 60
    
    if remaining_minutes == 0:
        return f"{hours} hr"
    else:
        return f"{hours} hr {remaining_minutes} min"

def sanitize_search_query(query: str) -> str:
    """Sanitize search query to prevent injection attacks"""
    # Remove special characters and limit length
    sanitized = ''.join(char for char in query if char.isalnum() or char.isspace())
    return sanitized[:100].strip()

def paginate_results(items: list, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    """Paginate a list of items"""
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    
    items_page = items[start:end]
    
    return {
        'items': items_page,
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': end < total
    }

def get_course_statistics(course, storage) -> Dict[str, Any]:
    """Get comprehensive statistics for a course"""
    # Get all progress records for this course
    course_progress = [p for p in storage.progress.values() if p.course_id == course.id]
    
    # Get reviews for this course
    course_reviews = storage.get_reviews_by_course(course.id)
    
    # Calculate statistics
    total_students = len(course.enrolled_students)
    completed_students = len([p for p in course_progress if p.completed_at])
    avg_progress = sum(p.progress_percentage for p in course_progress) / len(course_progress) if course_progress else 0
    
    # Rating statistics
    if course_reviews:
        avg_rating = sum(r.rating for r in course_reviews) / len(course_reviews)
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[i] = len([r for r in course_reviews if r.rating == i])
    else:
        avg_rating = 0
        rating_distribution = {i: 0 for i in range(1, 6)}
    
    return {
        'total_students': total_students,
        'completed_students': completed_students,
        'completion_rate': (completed_students / total_students * 100) if total_students > 0 else 0,
        'average_progress': avg_progress,
        'average_rating': avg_rating,
        'total_reviews': len(course_reviews),
        'rating_distribution': rating_distribution
    }

def is_token_expired(created_at: datetime, expiry_hours: int = 24) -> bool:
    """Check if a token is expired"""
    return datetime.utcnow() > created_at + timedelta(hours=expiry_hours)

def generate_course_slug(title: str) -> str:
    """Generate a URL-friendly slug from course title"""
    # Convert to lowercase and replace spaces with hyphens
    slug = title.lower().replace(' ', '-')
    # Remove special characters
    slug = ''.join(char for char in slug if char.isalnum() or char == '-')
    # Remove multiple consecutive hyphens
    while '--' in slug:
        slug = slug.replace('--', '-')
    return slug.strip('-')
