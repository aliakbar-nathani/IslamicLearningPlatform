// API Configuration and Base Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  created_at: string;
  profile: {
    first_name: string;
    last_name: string;
    bio: string;
    avatar_url: string;
    preferences: Record<string, any>;
  };
  enrolled_courses: string[];
  wishlist: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: string;
  level: string;
  price: number;
  thumbnail_url: string;
  preview_video_url: string;
  tags: string[];
  sections: Section[];
  created_at: string;
  updated_at: string;
  published: boolean;
  enrolled_students: number;
  rating: number;
  reviews: Review[];
  total_duration: number;
  language: string;
  prerequisites: string[];
  is_free: boolean;
  access_type: string;
  preview_config: {
    free_sections: string[];
    free_subsections: string[];
    preview_duration: number;
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  course_id: string;
  order: number;
  subsections: Subsection[];
  created_at: string;
  access_level: string;
  is_preview: boolean;
}

export interface Subsection {
  id: string;
  title: string;
  content_type: string;
  section_id: string;
  order: number;
  content: Record<string, any>;
  duration: number;
  created_at: string;
  is_preview: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

export interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  completed_subsections: string[];
  progress_percentage: number;
  last_accessed: string;
  created_at: string;
  updated_at: string;
  quiz_scores: Record<string, number>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<{ user: User; token: string; message: string }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string; message: string }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request('/api/auth/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<{ user: User; message: string }> {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Course endpoints
  async getCourses(params?: {
    search?: string;
    category?: string;
    level?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    courses: Course[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_prev: boolean;
      has_next: boolean;
    };
  }> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/courses${queryString ? `?${queryString}` : ''}`);
  }

  async getCourse(courseId: string): Promise<{ course: Course }> {
    return this.request(`/api/courses/${courseId}`);
  }

  async createCourse(courseData: Partial<Course>): Promise<{ course: Course; message: string }> {
    return this.request('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<{ course: Course; message: string }> {
    return this.request(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    return this.request(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    return this.request(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async unenrollFromCourse(courseId: string): Promise<{ message: string }> {
    return this.request(`/api/courses/${courseId}/enroll`, {
      method: 'DELETE',
    });
  }

  async getCourseReviews(courseId: string): Promise<{ reviews: Review[] }> {
    return this.request(`/api/courses/${courseId}/reviews`);
  }

  async createReview(courseId: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<{ review: Review; message: string }> {
    return this.request(`/api/courses/${courseId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getCourseCategories(): Promise<{ categories: string[] }> {
    return this.request('/api/courses/categories');
  }

  async getCourseSections(courseId: string): Promise<{ sections: Section[] }> {
    return this.request(`/api/courses/${courseId}/sections`);
  }

  async createSection(courseId: string, sectionData: Partial<Section>): Promise<{ section: Section; message: string }> {
    return this.request(`/api/courses/${courseId}/sections`, {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  // Progress endpoints
  async getProgress(userId: string, courseId: string): Promise<{ progress: Progress }> {
    return this.request(`/api/progress/${userId}/${courseId}`);
  }

  async updateProgress(userId: string, courseId: string, updates: Partial<Progress>): Promise<{ progress: Progress; message: string }> {
    return this.request(`/api/progress/${userId}/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async markSectionComplete(userId: string, courseId: string, sectionId: string): Promise<{ message: string }> {
    return this.request(`/api/progress/${userId}/${courseId}/sections/${sectionId}`, {
      method: 'POST',
    });
  }

  async markSubsectionComplete(userId: string, courseId: string, subsectionId: string): Promise<{ message: string }> {
    return this.request(`/api/progress/${userId}/${courseId}/subsections/${subsectionId}`, {
      method: 'POST',
    });
  }

  async getUserProgress(userId: string): Promise<{ progress: Progress[] }> {
    return this.request(`/api/progress/${userId}`);
  }

  // Access control endpoints
  async checkCourseAccess(courseId: string): Promise<{
    has_access: boolean;
    access_level: string;
    can_preview: boolean;
    preview_sections: string[];
    preview_subsections: string[];
    reason?: string;
  }> {
    return this.request(`/api/courses/${courseId}/access`);
  }

  async getSubsectionAccess(courseId: string, subsectionId: string): Promise<{
    has_access: boolean;
    content: any;
    is_preview: boolean;
    preview_duration?: number;
  }> {
    return this.request(`/api/courses/${courseId}/subsections/${subsectionId}/access`);
  }

  async getVideoStream(subsectionId: string): Promise<{
    stream_url: string;
    is_preview: boolean;
    preview_duration?: number;
  }> {
    return this.request(`/api/videos/${subsectionId}/stream`);
  }

  // User endpoints
  async getUserCourses(userId: string): Promise<{
    enrolled_courses: Course[];
    created_courses: Course[];
    wishlist: Course[];
  }> {
    return this.request(`/api/users/${userId}/courses`);
  }

  async addToWishlist(userId: string, courseId: string): Promise<{ message: string }> {
    return this.request(`/api/users/${userId}/wishlist/${courseId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(userId: string, courseId: string): Promise<{ message: string }> {
    return this.request(`/api/users/${userId}/wishlist/${courseId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;