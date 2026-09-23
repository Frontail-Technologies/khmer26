export type AdminStaffRole = "super_admin" | "admin" | "moderator" | "support"

export type AdminStaffStatus = "active" | "inactive" | "suspended"

export interface AdminStaffMember {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: AdminStaffRole
  status: AdminStaffStatus
  twoFactorEnabled: boolean
  lastActiveAt: string
  assignedModules: string[]
  joinedAt: string
}

export interface PermissionItem {
  key: string
  name: string
  description: string
}

export interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: PermissionItem[]
}

export interface RoleDefinition {
  id: AdminStaffRole
  name: string
  description: string
  assignedStaffCount: number
  grantedPermissions: string[]
}

export interface RoleStats {
  totalStaff: number
  superAdmins: number
  moderators: number
  supportAgents: number
}
