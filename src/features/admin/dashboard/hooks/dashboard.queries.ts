import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminDashboard } from '../api/dashboard.api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard.overview(),
    queryFn: getAdminDashboard,
  });
}
