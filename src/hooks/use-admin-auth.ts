'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { adminKeys } from '@/lib/query/keys';

export interface AdminUser {
  id: string;
  email: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
  emailVerifiedAt: string | null;
  createdAt: string;
}

export function useAdminAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: adminKeys.auth(),
    queryFn: async () => {
      const res = await apiClient.get<{ user: AdminUser }>('/auth/me');
      return res.data?.user || null;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = data || null;
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email?: string; password?: string }) => {
      const res = await apiClient.post<{ user: AdminUser }>('/auth/login', credentials);
      return res.data.user;
    },
    onSuccess: (loggedUser) => {
      if (loggedUser.role !== 'admin') {
        queryClient.setQueryData(adminKeys.auth(), null);
        void apiClient.post('/auth/logout');
        toast.error('Access denied. Administrator privileges required.');
        return;
      }
      queryClient.setQueryData(adminKeys.auth(), loggedUser);
      toast.success('Signed in as administrator');
      router.push('/admin');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Invalid credentials or login failed';
      toast.error(msg);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(adminKeys.auth(), null);
      queryClient.clear();
      toast.success('Signed out successfully');
      router.push('/admin/login');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to sign out';
      toast.error(msg);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    error,
    refetch,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
