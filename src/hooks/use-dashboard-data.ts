import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { DashboardData } from '@/types/dashboard';

export function useDashboardData(timeRange: 'day' | 'week' | 'month' | 'year' = 'month') {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'analytics', timeRange],
    queryFn: async () => {
      const response = await apiClient.get<DashboardData>('/api/v1/dashboard/analytics', {
        params: { timeRange },
      });
      if (!response.data) {
        throw new Error('No data received from the server');
      }
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
} 