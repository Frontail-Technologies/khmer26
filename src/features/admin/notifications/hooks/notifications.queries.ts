import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminBroadcasts } from '../api/notifications.api';

export function useAdminBroadcasts(params?: { page?: number; limit?: number; audience?: string }) {
  return useQuery({
    queryKey: adminKeys.notifications.broadcasts(params),
    queryFn: () => getAdminBroadcasts(params),
  });
}
