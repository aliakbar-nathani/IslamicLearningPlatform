import re
from typing import Dict, Any, List

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def validate_course_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate course creation/update data"""
    errors = []
    
    required_fields = ['title', 'description', 'category']
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
    
    if 'title' in data and len(data['title']) < 3:
        errors.append("Title must be at least 3 characters long")
    
    if 'description' in data and len(data['description']) < 10:
        errors.append("Description must be at least 10 characters long")
    
    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0:
                errors.append("Price cannot be negative")
        except (ValueError, TypeError):
            errors.append("Price must be a valid number")
    
    if 'level' in data and data['level'] not in ['Beginner', 'Intermediate', 'Advanced']:
        errors.append("Level must be one of: Beginner, Intermediate, Advanced")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def validate_section_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate section creation/update data"""
    errors = []
    
    required_fields = ['title', 'course_id']
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
    
    if 'title' in data and len(data['title']) < 3:
        errors.append("Title must be at least 3 characters long")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def validate_subsection_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate subsection creation/update data"""
    errors = []
    
    required_fields = ['title', 'content_type', 'section_id']
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
    
    if 'content_type' in data and data['content_type'] not in ['video', 'text', 'pdf', 'quiz', 'assignment']:
        errors.append("Content type must be one of: video, text, pdf, quiz, assignment")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def validate_quiz_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate quiz creation/update data"""
    errors = []
    
    required_fields = ['title', 'section_id']
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
    
    if 'passing_score' in data:
        try:
            score = int(data['passing_score'])
            if score < 0 or score > 100:
                errors.append("Passing score must be between 0 and 100")
        except (ValueError, TypeError):
            errors.append("Passing score must be a valid number")
    
    if 'time_limit' in data:
        try:
            time_limit = int(data['time_limit'])
            if time_limit < 1:
                errors.append("Time limit must be at least 1 minute")
        except (ValueError, TypeError):
            errors.append("Time limit must be a valid number")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }
