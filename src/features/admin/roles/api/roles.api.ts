import { apiClient } from '@/lib/api/client';
import type { AdminStaffMember, RoleDefinition, PermissionModuleGroup, AdminStaffRole } from '../types';

export interface BackendRoleDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendPermissionDto {
  id: string;
  key: string;
  description: string | null;
  module: string | null;
}

export interface BackendStaffDto {
  userId: string;
  email: string | null;
  role: string;
  roles: Array<{
    roleId: string;
    roleName: string;
    assignedAt: string;
  }>;
}

function toStaffRole(roleName?: string): AdminStaffRole {
  const normalized = (roleName || '').toLowerCase();
  if (normalized.includes('super')) return 'super_admin';
  if (normalized.includes('moderator')) return 'moderator';
  if (normalized.includes('support')) return 'support';
  return 'admin';
}

export async function getAdminRoles(): Promise<RoleDefinition[]> {
  const res = await apiClient.get<{ roles: BackendRoleDto[] }>('/admin/roles');
  const roles = res.data?.roles || [];
  const details = await Promise.all(
    roles.map(async (r) => {
      const detail = await apiClient.get<{ permissions: BackendPermissionDto[] }>(`/admin/roles/${r.id}`);
      const permissions = detail.data?.permissions || [];
      return {
        id: r.id,
        name: r.name,
        description: r.description || '',
        staffCount: 0,
        accessSummary: permissions.length ? `${permissions.length} permissions assigned` : 'No permissions assigned',
        isSystem: r.name.toLowerCase().includes('super'),
        permissions: permissions.map((p) => p.id),
      };
    })
  );
  return details;
}

export async function getAdminPermissions(): Promise<PermissionModuleGroup[]> {
  const res = await apiClient.get<{ permissions: BackendPermissionDto[] }>('/admin/permissions');
  const perms = res.data?.permissions || [];

  const groups = new Map<string, { id: string; name: string; description: string; permissions: Array<{ id: string; name: string; description: string }> }>();
  for (const p of perms) {
    const mod = p.module || p.key.split('.')[0] || 'general';
    if (!groups.has(mod)) {
      groups.set(mod, {
        id: mod,
        name: mod.charAt(0).toUpperCase() + mod.slice(1) + ' Management',
        description: `Permissions controlling ${mod} operations`,
        permissions: [],
      });
    }
    groups.get(mod)!.permissions.push({
      id: p.id,
      name: p.key,
      description: p.description || p.key,
    });
  }

  return Array.from(groups.values());
}

export async function getAdminStaff(): Promise<AdminStaffMember[]> {
  const res = await apiClient.get<{ staff: BackendStaffDto[] }>('/admin/staff');
  const staff = res.data?.staff || [];
  return staff.map((s) => ({
    id: s.userId,
    name: s.email?.split('@')[0] || 'Staff Member',
    email: s.email || '',
    role: toStaffRole(s.roles[0]?.roleName || s.role),
    status: 'active',
    lastActiveAt: 'Active recently',
    joinedAt: s.roles[0]?.assignedAt ? new Date(s.roles[0].assignedAt).toLocaleDateString() : 'Unknown',
  }));
}

export async function createAdminRole(data: { name: string; description?: string }) {
  return apiClient.post('/admin/roles', data);
}

export async function updateAdminRole(id: string, data: { name?: string; description?: string }) {
  return apiClient.patch(`/admin/roles/${id}`, data);
}

export async function replaceRolePermissions(roleId: string, permissionIds: string[]) {
  return apiClient.post(`/admin/roles/${roleId}/permissions`, { permissionIds });
}

export async function assignStaffRole(userId: string, roleId: string) {
  return apiClient.post(`/admin/staff/${userId}/roles`, { roleId });
}

export async function removeStaffRole(userId: string, roleId: string) {
  return apiClient.delete(`/admin/staff/${userId}/roles/${roleId}`);
}

export async function createAdminPermission(data: { key: string; description?: string | null }) {
  return apiClient.post('/admin/permissions', data);
}
