import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminKeys } from '@/lib/query/keys';
import { updateAdminSettings } from '../api/settings.api';
import type { PlatformSettings } from '../types';

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PlatformSettings>) => updateAdminSettings(payload),
    onSuccess: () => {
      toast.success('System configuration saved');
      queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to save settings';
      toast.error(msg);
    },
  });
}
