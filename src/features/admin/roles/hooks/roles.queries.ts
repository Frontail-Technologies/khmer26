import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminRoles, getAdminPermissions, getAdminStaff } from '../api/roles.api';

export function useAdminRoles() {
  return useQuery({
    queryKey: adminKeys.roles.list(),
    queryFn: getAdminRoles,
  });
}

export function useAdminPermissions() {
  return useQuery({
    queryKey: adminKeys.roles.permissions(),
    queryFn: getAdminPermissions,
  });
}

export function useAdminStaff() {
  return useQuery({
    queryKey: adminKeys.roles.staff(),
    queryFn: getAdminStaff,
  });
}
