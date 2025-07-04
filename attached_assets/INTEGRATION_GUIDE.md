# React Frontend Integration Guide

This guide explains how to integrate your existing React app with the Flask backend API.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment configuration:
```bash
cp .env.example .env
```

Make sure your `.env` file contains:
```
VITE_API_URL=http://localhost:5000
```

### 2. Install Additional Dependencies

Your app already has most dependencies, but ensure you have:
- `@tanstack/react-query` ✅ (already installed)
- `react-router-dom` ✅ (already installed)
- All other dependencies are already present

### 3. Replace Components

Replace these files in your React app:

#### Core Services
- Replace `src/contexts/AuthContext.tsx` with `src/contexts/AuthContextIntegrated.tsx`
- Add `src/services/api.ts` (new API client)

#### Hooks
- Add `src/hooks/useCourses.ts` (course management)
- Add `src/hooks/useProgress.ts` (progress tracking)
- Add `src/hooks/useAccess.ts` (access control)

#### Pages
- Replace `src/pages/Courses.tsx` with `src/pages/CoursesIntegrated.tsx`
- Replace `src/pages/CourseDetail.tsx` with `src/pages/CourseDetailIntegrated.tsx`
- Replace `src/pages/Dashboard.tsx` with `src/pages/DashboardIntegrated.tsx`

### 4. Update App.tsx

Update your main App component to use the new AuthContext:

```typescript
// Replace this import
import { AuthProvider } from "@/contexts/AuthContext";

// With this
import { AuthProvider } from "@/contexts/AuthContextIntegrated";
```

### 5. Update Route Components

Update your route imports in `App.tsx`:

```typescript
// Replace these imports
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";

// With these
import Courses from "./pages/CoursesIntegrated";
import CourseDetail from "./pages/CourseDetailIntegrated";
import Dashboard from "./pages/DashboardIntegrated";
```

## 🔧 Features Included

### ✅ Authentication
- **Login/Register**: Real user authentication with JWT tokens
- **Profile Management**: Update user profiles and preferences
- **Session Persistence**: Tokens stored securely in localStorage
- **Role-Based Access**: Student, instructor, and admin roles

### ✅ Course Management
- **Dynamic Course Loading**: Real courses from Flask API
- **Search & Filtering**: By category, level, and search terms
- **Pagination**: Efficient loading of large course lists
- **Course Details**: Complete course information with sections

### ✅ Access Control
- **Free vs Paid Content**: Automatic access level detection
- **Preview System**: Video previews for non-enrolled users
- **Enrollment Tracking**: Real-time enrollment status
- **Progress Gating**: Content unlocked based on enrollment

### ✅ Progress Tracking
- **Real-time Progress**: Track completion of sections and subsections
- **Dashboard Analytics**: Visual progress charts and statistics
- **Learning Path**: Guided progression through course content
- **Certificates**: Completion certificates for finished courses

### ✅ Enhanced Features
- **Review System**: Course ratings and reviews from real users
- **Wishlist**: Save courses for later
- **Recommendations**: Personalized course suggestions
- **Error Handling**: Graceful error states with user feedback

## 🔗 API Integration

### Base API Client
The `src/services/api.ts` file provides a complete API client with:
- Automatic token management
- Error handling and retries
- TypeScript type safety
- Request/response interceptors

### React Query Integration
All API calls use TanStack Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading states

### Key Hooks Available

#### Course Hooks
```typescript
import { useCourses, useCourse, useCourseCategories } from '@/hooks/useCourses';

// Get all courses with filtering
const { data: coursesData, isLoading } = useCourses({
  search: 'Quran',
  category: 'Quran Studies',
  level: 'Beginner'
});

// Get specific course
const { data: courseData } = useCourse('course-id');

// Get categories
const { data: categoriesData } = useCourseCategories();
```

#### Progress Hooks
```typescript
import { useProgress, useUserProgress } from '@/hooks/useProgress';

// Get course progress
const { data: progressData } = useProgress(userId, courseId);

// Get all user progress
const { data: userProgressData } = useUserProgress(userId);
```

#### Access Control Hooks
```typescript
import { useCourseAccess, useSubsectionAccess } from '@/hooks/useAccess';

// Check course access
const { data: accessData } = useCourseAccess(courseId);

// Check subsection access
const { data: subsectionAccess } = useSubsectionAccess(courseId, subsectionId);
```

## 🎨 UI Components Enhanced

### Course Cards
- Real course data (title, description, instructor, price)
- Dynamic thumbnails and preview videos
- Access level indicators (FREE, PAID, ENROLLED)
- Real-time enrollment counts and ratings

### Progress Indicators
- Visual progress bars showing completion percentage
- Section-by-section progress tracking
- Time-based progress analytics
- Achievement badges for milestones

### Access Control UI
- Preview mode for non-enrolled users
- Enrollment buttons with real API integration
- Payment status indicators
- Content locking based on access level

## 🔒 Security Features

### Authentication Security
- JWT token-based authentication
- Automatic token refresh
- Secure logout with server-side cleanup
- Protected routes based on authentication status

### Access Control
- Server-side access validation
- Role-based permissions
- Content protection for paid courses
- Preview limitations for free users

## 📱 Development Workflow

### 1. Start Backend
```bash
# In your Flask backend directory
python test_api.py  # Test API functionality
# Backend runs on http://localhost:5000
```

### 2. Start Frontend
```bash
# In your React app directory
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Test Integration
1. Register a new user
2. Browse courses
3. Enroll in a course
4. Track progress
5. Test access control

## 🚀 Production Deployment

### Backend Deployment
1. Update `VITE_API_URL` in your `.env` to your production API URL
2. Deploy Flask backend to your preferred hosting service
3. Ensure CORS is configured for your frontend domain

### Frontend Deployment
1. Build your React app: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production

## 🔧 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure Flask backend has correct CORS configuration
- Check that `VITE_API_URL` points to the correct backend URL

#### Authentication Issues
- Clear localStorage if having token issues
- Check network tab for API request/response details
- Verify backend is running and accessible

#### API Connection Issues
- Verify backend is running on correct port (5000)
- Check firewall settings
- Ensure no port conflicts

### Debug Mode
Enable debug logging by adding to your `.env`:
```
VITE_DEBUG=true
```

## 📚 Next Steps

1. **Customize UI**: Adapt the integrated components to match your design system
2. **Add Features**: Implement additional features like live chat, forums, etc.
3. **Performance**: Optimize API calls and add more specific caching strategies
4. **Testing**: Add unit and integration tests for the new API integration
5. **Monitoring**: Add error tracking and analytics for production use

## 🎉 You're Ready!

Your React app is now fully integrated with the dynamic Flask backend, providing real-time course management, user authentication, progress tracking, and access control.

The static course platform has been successfully transformed into a dynamic, database-driven Islamic learning management system!