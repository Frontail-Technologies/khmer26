import { z } from 'zod';

export const roleFormSchema = z.object({
  name: z.string().trim().min(1, 'Role name is required').max(80),
  description: z.string().trim().max(500).nullable().optional(),
});

export const permissionFormSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, 'Permission key is required')
    .max(120)
    .regex(/^[a-z0-9_.]+$/, 'Only lowercase letters, digits, dots, and underscores'),
  description: z.string().trim().max(500).nullable().optional(),
});

export const assignRoleSchema = z.object({
  roleId: z.string().uuid('Must be a valid role UUID'),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
export type PermissionFormValues = z.infer<typeof permissionFormSchema>;
export type AssignRoleValues = z.infer<typeof assignRoleSchema>;
