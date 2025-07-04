import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { Progress } from '@/services/api';

export const useProgress = (userId: string, courseId: string) => {
  return useQuery({
    queryKey: ['progress', userId, courseId],
    queryFn: () => apiClient.getProgress(userId, courseId),
    enabled: !!userId && !!courseId,
  });
};

export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ['user-progress', userId],
    queryFn: () => apiClient.getUserProgress(userId),
    enabled: !!userId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, courseId, updates }: { userId: string; courseId: string; updates: Partial<Progress> }) =>
      apiClient.updateProgress(userId, courseId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['user-progress', variables.userId] });
    },
  });
};

export const useMarkSectionComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, courseId, sectionId }: { userId: string; courseId: string; sectionId: string }) =>
      apiClient.markSectionComplete(userId, courseId, sectionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['user-progress', variables.userId] });
    },
  });
};

export const useMarkSubsectionComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, courseId, subsectionId }: { userId: string; courseId: string; subsectionId: string }) =>
      apiClient.markSubsectionComplete(userId, courseId, subsectionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['user-progress', variables.userId] });
    },
  });
};