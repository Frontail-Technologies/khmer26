import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminUsers, getAdminUser, type AdminUsersQueryParams } from '../api/users.api';

export function useAdminUsers(params: AdminUsersQueryParams) {
  return useQuery({
    queryKey: adminKeys.users.list(params),
    queryFn: () => getAdminUsers(params),
  });
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.users.detail(id),
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });
}
