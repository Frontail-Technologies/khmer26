'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/lib/query/keys';
import { getMe, type AuthUser } from '../api/auth.api';
import { ApiError } from '@/lib/api/client';

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const query = useQuery<AuthUser | null, ApiError>({
    queryKey: authKeys.session(),
    queryFn: async () => {
      try {
        return await getMe();
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    function handleRefreshFailed() {
      queryClient.setQueryData(authKeys.session(), null);
    }
    window.addEventListener('auth:refresh-failed', handleRefreshFailed);
    return () => window.removeEventListener('auth:refresh-failed', handleRefreshFailed);
  }, [queryClient]);

  const user = query.data ?? null;
  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
}
