import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { updateAdminReviewStatus } from '../api/reviews.api';
import { toast } from 'sonner';

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, visibility }: { id: string; visibility: 'visible' | 'hidden' }) =>
      updateAdminReviewStatus(id, visibility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reviews.all });
      toast.success('Review status updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update review status';
      toast.error(msg);
    },
  });
}
