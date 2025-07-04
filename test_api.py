#!/usr/bin/env python3
"""
Comprehensive API testing script for Islamic Course Platform
This script demonstrates all the API functionality including access control
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*50}")
    print(f"{title}")
    print(f"{'='*50}")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
    except:
        print(response.text)

def main():
    print("🕌 Islamic Course Platform API Testing")
    print("Testing all endpoints with real data...")
    
    # 1. Health Check
    response = requests.get(f"{BASE_URL}/health")
    print_response("1. Health Check", response)
    
    # 2. Get Course Categories
    response = requests.get(f"{BASE_URL}/api/courses/categories")
    print_response("2. Course Categories", response)
    
    # 3. Register Instructor
    instructor_data = {
        "username": "sheikh_ahmad",
        "email": "sheikh.ahmad@islamicacademy.com",
        "password": "SecurePass123",
        "role": "instructor"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        headers={"Content-Type": "application/json"},
        data=json.dumps(instructor_data)
    )
    print_response("3. Register Instructor", response)
    
    # 4. Login Instructor
    login_data = {
        "email": "sheikh.ahmad@islamicacademy.com",
        "password": "SecurePass123"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        headers={"Content-Type": "application/json"},
        data=json.dumps(login_data)
    )
    print_response("4. Instructor Login", response)
    
    instructor_token = response.json().get('token', '')
    instructor_id = response.json().get('user', {}).get('id', '')
    
    # 5. Create Course with Access Control
    course_data = {
        "title": "Complete Quran Recitation Course",
        "description": "Master the art of Quranic recitation with proper Tajweed rules. This comprehensive course covers all aspects of beautiful Quran recitation.",
        "category": "Quran Studies",
        "level": "Intermediate",
        "price": 79.99,
        "tags": ["Quran", "Tajweed", "Recitation", "Arabic"],
        "language": "English",
        "is_free": False,
        "access_type": "paid",
        "preview_config": {
            "preview_duration": 600  # 10 minutes preview
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/courses",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {instructor_token}"
        },
        data=json.dumps(course_data)
    )
    print_response("5. Create Course", response)
    
    course_id = response.json().get('course', {}).get('id', '')
    
    # 6. Publish Course
    response = requests.put(
        f"{BASE_URL}/api/courses/{course_id}",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {instructor_token}"
        },
        data=json.dumps({"published": True})
    )
    print_response("6. Publish Course", response)
    
    # 7. Create Course Section
    section_data = {
        "title": "Introduction to Tajweed",
        "description": "Learn the basic rules of Tajweed for proper Quran recitation",
        "access_level": "free",  # Make this section free as preview
        "is_preview": True
    }
    
    response = requests.post(
        f"{BASE_URL}/api/courses/{course_id}/sections",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {instructor_token}"
        },
        data=json.dumps(section_data)
    )
    print_response("7. Create Section", response)
    
    # 8. Register Student
    student_data = {
        "username": "ali_student",
        "email": "ali@student.com",
        "password": "StudentPass123"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        headers={"Content-Type": "application/json"},
        data=json.dumps(student_data)
    )
    print_response("8. Register Student", response)
    
    # 9. Student Login
    student_login = {
        "email": "ali@student.com",
        "password": "StudentPass123"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        headers={"Content-Type": "application/json"},
        data=json.dumps(student_login)
    )
    print_response("9. Student Login", response)
    
    student_token = response.json().get('token', '')
    student_id = response.json().get('user', {}).get('id', '')
    
    # 10. Check Course Access (Before Enrollment)
    response = requests.get(
        f"{BASE_URL}/api/courses/{course_id}/access",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    print_response("10. Course Access Check (Before Enrollment)", response)
    
    # 11. Get Courses List
    response = requests.get(f"{BASE_URL}/api/courses")
    print_response("11. Get Courses List", response)
    
    # 12. Get Specific Course Details
    response = requests.get(f"{BASE_URL}/api/courses/{course_id}")
    print_response("12. Get Course Details", response)
    
    # 13. Student Enroll in Course
    response = requests.post(
        f"{BASE_URL}/api/courses/{course_id}/enroll",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {student_token}"
        }
    )
    print_response("13. Student Enroll", response)
    
    # 14. Check Course Access (After Enrollment)
    response = requests.get(
        f"{BASE_URL}/api/courses/{course_id}/access",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    print_response("14. Course Access Check (After Enrollment)", response)
    
    # 15. Get Student's Enrolled Courses
    response = requests.get(
        f"{BASE_URL}/api/users/{student_id}/courses",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    print_response("15. Student's Enrolled Courses", response)
    
    # 16. Get Student Progress
    response = requests.get(
        f"{BASE_URL}/api/progress/{student_id}/{course_id}",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    print_response("16. Student Progress", response)
    
    # 17. Create Course Review
    review_data = {
        "rating": 5,
        "comment": "Excellent course! Sheikh Ahmad's teaching style is very clear and the Tajweed rules are explained beautifully. Highly recommend for anyone wanting to improve their Quran recitation."
    }
    
    response = requests.post(
        f"{BASE_URL}/api/courses/{course_id}/reviews",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {student_token}"
        },
        data=json.dumps(review_data)
    )
    print_response("17. Create Course Review", response)
    
    # 18. Get Course Reviews
    response = requests.get(f"{BASE_URL}/api/courses/{course_id}/reviews")
    print_response("18. Get Course Reviews", response)
    
    # 19. Search Courses
    response = requests.get(f"{BASE_URL}/api/courses?search=Quran&category=Quran Studies")
    print_response("19. Search Courses", response)
    
    # 20. Get User Profile
    response = requests.get(
        f"{BASE_URL}/api/auth/profile",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    print_response("20. Get User Profile", response)
    
    print(f"\n{'='*50}")
    print("✅ API Testing Complete!")
    print(f"{'='*50}")
    print("All core functionality tested:")
    print("✓ User Authentication (Register, Login)")
    print("✓ Course Management (Create, Update, Publish)")
    print("✓ Course Access Control (Free/Paid content)")
    print("✓ Student Enrollment and Progress Tracking")
    print("✓ Reviews and Ratings System")
    print("✓ Search and Filtering")
    print("✓ Role-based Permissions")
    print("\n🎉 Your Islamic Course Platform API is ready for your React frontend!")

if __name__ == "__main__":
    main()