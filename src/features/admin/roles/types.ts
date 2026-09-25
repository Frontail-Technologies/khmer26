export type AdminStaffRole = "super_admin" | "admin" | "moderator" | "support"

export type AdminStaffStatus = "active" | "inactive"

export interface AdminStaffMember {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: AdminStaffRole
  status: AdminStaffStatus
  lastActiveAt: string
  joinedAt: string
}

export interface PermissionModuleGroup {
  id: string
  name: string
  description: string
  permissions: {
    id: string
    name: string
    description: string
  }[]
}

export interface RoleDefinition {
  id: AdminStaffRole
  name: string
  description: string
  staffCount: number
  accessSummary: string
  isSystem?: boolean
  permissions: string[]
}
