import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { updateChatReportStatus } from '../api/chat-reports.api';
import { toast } from 'sonner';

export function useUpdateChatReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'resolved' | 'dismissed'; notes?: string }) =>
      updateChatReportStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Chat report updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update chat report';
      toast.error(msg);
    },
  });
}
