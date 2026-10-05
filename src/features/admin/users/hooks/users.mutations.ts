import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { deleteAdminUser, updateAdminUser, updateUserStatus } from '../api/users.api';
import { toast } from 'sonner';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: 'active' | 'banned'; reason?: string }) =>
      updateUserStatus(id, status, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('User status updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update user status';
      toast.error(msg);
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminUser>[1] }) =>
      updateAdminUser(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('User updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update user';
      toast.error(msg);
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('User deleted');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(msg);
    },
  });
}
