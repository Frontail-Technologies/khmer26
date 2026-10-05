import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminSettings } from '../api/settings.api';

export function useAdminSettings() {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: getAdminSettings,
    staleTime: 60_000,
  });
}
