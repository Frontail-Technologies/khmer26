import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { createAdminBroadcast, updateAdminBroadcast, deleteAdminBroadcast } from '../api/notifications.api';
import { toast } from 'sonner';

export function useCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.notifications.all });
      toast.success('Broadcast notification queued successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to dispatch broadcast';
      toast.error(msg);
    },
  });
}

export function useUpdateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; body?: string } }) =>
      updateAdminBroadcast(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.notifications.all });
      toast.success('Broadcast updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update broadcast';
      toast.error(msg);
    },
  });
}

export function useDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.notifications.all });
      toast.success('Broadcast deleted');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete broadcast';
      toast.error(msg);
    },
  });
}
