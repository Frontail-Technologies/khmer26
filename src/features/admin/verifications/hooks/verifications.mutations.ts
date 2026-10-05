import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { approveVerification, rejectVerification } from '../api/verifications.api';
import { toast } from 'sonner';

export function useApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveVerification,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Verification approved');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to approve verification';
      toast.error(msg);
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectVerification(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Verification rejected');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to reject verification';
      toast.error(msg);
    },
  });
}
