"""
In-memory storage for MVP. In production, this would be replaced with MongoDB.
"""
from typing import Dict, List, Optional
from models import User, Course, Section, Subsection, Quiz, Progress, Review
import threading

class InMemoryStorage:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.courses: Dict[str, Course] = {}
        self.sections: Dict[str, Section] = {}
        self.subsections: Dict[str, Subsection] = {}
        self.quizzes: Dict[str, Quiz] = {}
        self.progress: Dict[str, Progress] = {}
        self.reviews: Dict[str, Review] = {}
        self.user_sessions: Dict[str, str] = {}  # token -> user_id
        self._lock = threading.Lock()

    def create_user(self, user: User) -> User:
        with self._lock:
            self.users[user.id] = user
            return user

    def get_user(self, user_id: str) -> Optional[User]:
        return self.users.get(user_id)

    def get_user_by_email(self, email: str) -> Optional[User]:
        for user in self.users.values():
            if user.email == email:
                return user
        return None

    def get_user_by_username(self, username: str) -> Optional[User]:
        for user in self.users.values():
            if user.username == username:
                return user
        return None

    def update_user(self, user_id: str, updates: dict) -> Optional[User]:
        with self._lock:
            user = self.users.get(user_id)
            if user:
                for key, value in updates.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
                return user
            return None

    def delete_user(self, user_id: str) -> bool:
        with self._lock:
            if user_id in self.users:
                del self.users[user_id]
                return True
            return False

    def create_course(self, course: Course) -> Course:
        with self._lock:
            self.courses[course.id] = course
            return course

    def get_course(self, course_id: str) -> Optional[Course]:
        return self.courses.get(course_id)

    def get_courses(self, filters: dict = None) -> List[Course]:
        courses = list(self.courses.values())
        
        if filters:
            if 'category' in filters:
                courses = [c for c in courses if c.category == filters['category']]
            if 'level' in filters:
                courses = [c for c in courses if c.level == filters['level']]
            if 'instructor_id' in filters:
                courses = [c for c in courses if c.instructor_id == filters['instructor_id']]
            if 'published' in filters:
                courses = [c for c in courses if c.published == filters['published']]
            if 'search' in filters:
                search_term = filters['search'].lower()
                courses = [c for c in courses if 
                          search_term in c.title.lower() or 
                          search_term in c.description.lower() or
                          any(search_term in tag.lower() for tag in c.tags)]
        
        return courses

    def update_course(self, course_id: str, updates: dict) -> Optional[Course]:
        with self._lock:
            course = self.courses.get(course_id)
            if course:
                for key, value in updates.items():
                    if hasattr(course, key):
                        setattr(course, key, value)
                return course
            return None

    def delete_course(self, course_id: str) -> bool:
        with self._lock:
            if course_id in self.courses:
                del self.courses[course_id]
                return True
            return False

    def create_section(self, section: Section) -> Section:
        with self._lock:
            self.sections[section.id] = section
            # Add to course
            course = self.courses.get(section.course_id)
            if course:
                course.sections.append(section)
            return section

    def get_section(self, section_id: str) -> Optional[Section]:
        return self.sections.get(section_id)

    def get_sections_by_course(self, course_id: str) -> List[Section]:
        return [s for s in self.sections.values() if s.course_id == course_id]

    def create_subsection(self, subsection: Subsection) -> Subsection:
        with self._lock:
            self.subsections[subsection.id] = subsection
            # Add to section
            section = self.sections.get(subsection.section_id)
            if section:
                section.subsections.append(subsection)
            return subsection

    def get_subsection(self, subsection_id: str) -> Optional[Subsection]:
        return self.subsections.get(subsection_id)

    def create_quiz(self, quiz: Quiz) -> Quiz:
        with self._lock:
            self.quizzes[quiz.id] = quiz
            return quiz

    def get_quiz(self, quiz_id: str) -> Optional[Quiz]:
        return self.quizzes.get(quiz_id)

    def create_progress(self, progress: Progress) -> Progress:
        with self._lock:
            self.progress[progress.id] = progress
            return progress

    def get_progress(self, user_id: str, course_id: str) -> Optional[Progress]:
        for progress in self.progress.values():
            if progress.user_id == user_id and progress.course_id == course_id:
                return progress
        return None

    def get_user_progress(self, user_id: str) -> List[Progress]:
        return [p for p in self.progress.values() if p.user_id == user_id]

    def update_progress(self, progress_id: str, updates: dict) -> Optional[Progress]:
        with self._lock:
            progress = self.progress.get(progress_id)
            if progress:
                for key, value in updates.items():
                    if hasattr(progress, key):
                        setattr(progress, key, value)
                return progress
            return None

    def create_review(self, review: Review) -> Review:
        with self._lock:
            self.reviews[review.id] = review
            return review

    def get_reviews_by_course(self, course_id: str) -> List[Review]:
        return [r for r in self.reviews.values() if r.course_id == course_id]

    def create_session(self, token: str, user_id: str):
        with self._lock:
            self.user_sessions[token] = user_id

    def get_user_by_token(self, token: str) -> Optional[User]:
        user_id = self.user_sessions.get(token)
        if user_id:
            return self.users.get(user_id)
        return None

    def delete_session(self, token: str) -> bool:
        with self._lock:
            if token in self.user_sessions:
                del self.user_sessions[token]
                return True
            return False

# Global storage instance
storage = InMemoryStorage()
