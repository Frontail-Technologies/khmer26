import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminProvinces } from '../api/locations.api';

export function useAdminProvinces() {
  return useQuery({
    queryKey: adminKeys.locations.provinces(),
    queryFn: getAdminProvinces,
  });
}
