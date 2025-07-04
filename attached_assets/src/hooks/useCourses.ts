import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { Course } from '@/services/api';

export const useCourses = (params?: {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => apiClient.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => apiClient.getCourse(courseId),
    enabled: !!courseId,
  });
};

export const useCourseCategories = () => {
  return useQuery({
    queryKey: ['course-categories'],
    queryFn: () => apiClient.getCourseCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

export const useCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ['course-reviews', courseId],
    queryFn: () => apiClient.getCourseReviews(courseId),
    enabled: !!courseId,
  });
};

export const useCourseSections = (courseId: string) => {
  return useQuery({
    queryKey: ['course-sections', courseId],
    queryFn: () => apiClient.getCourseSections(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: Partial<Course>) => apiClient.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, updates }: { courseId: string; updates: Partial<Course> }) =>
      apiClient.updateCourse(courseId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => apiClient.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => apiClient.enrollInCourse(courseId),
    onSuccess: (data, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['user-courses'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

export const useUnenrollFromCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => apiClient.unenrollFromCourse(courseId),
    onSuccess: (data, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['user-courses'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, reviewData }: { courseId: string; reviewData: { rating: number; comment: string } }) =>
      apiClient.createReview(courseId, reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-reviews', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, sectionData }: { courseId: string; sectionData: any }) =>
      apiClient.createSection(courseId, sectionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-sections', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};