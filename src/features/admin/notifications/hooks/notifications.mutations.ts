import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { createAdminBroadcast } from '../api/notifications.api';
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
