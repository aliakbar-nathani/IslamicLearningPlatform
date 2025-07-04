import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';

export const useCourseAccess = (courseId: string) => {
  return useQuery({
    queryKey: ['course-access', courseId],
    queryFn: () => apiClient.checkCourseAccess(courseId),
    enabled: !!courseId,
  });
};

export const useSubsectionAccess = (courseId: string, subsectionId: string) => {
  return useQuery({
    queryKey: ['subsection-access', courseId, subsectionId],
    queryFn: () => apiClient.getSubsectionAccess(courseId, subsectionId),
    enabled: !!courseId && !!subsectionId,
  });
};

export const useVideoStream = (subsectionId: string) => {
  return useQuery({
    queryKey: ['video-stream', subsectionId],
    queryFn: () => apiClient.getVideoStream(subsectionId),
    enabled: !!subsectionId,
  });
};