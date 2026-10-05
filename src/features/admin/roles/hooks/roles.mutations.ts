import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  createAdminRole,
  updateAdminRole,
  assignStaffRole,
  replaceRolePermissions,
} from '../api/roles.api';
import { toast } from 'sonner';

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success('Role created successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create role';
      toast.error(msg);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      updateAdminRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success('Role updated successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update role';
      toast.error(msg);
    },
  });
}

export function useAssignStaffRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      assignStaffRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.staff() });
      toast.success('Staff role assigned');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to assign role';
      toast.error(msg);
    },
  });
}

export function useReplaceRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      replaceRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles.all });
      toast.success('Role permissions updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update permissions';
      toast.error(msg);
    },
  });
}
