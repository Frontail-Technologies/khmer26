import type { Metadata } from "next"
import { RolesWorkspace } from "@/features/admin/roles/components/roles-workspace"
import {
  DEMO_ROLE_STATS,
  DEMO_ADMIN_STAFF,
  ROLE_DEFINITIONS,
  PERMISSION_GROUPS,
} from "@/features/admin/roles/data/demo-roles-data"

export const metadata: Metadata = {
  title: "Admin Roles & Staff",
  description: "Configure staff permissions, RBAC policies, and administrative roles.",
}

export default function AdminRolesPage() {
  return (
    <RolesWorkspace
      stats={DEMO_ROLE_STATS}
      staff={DEMO_ADMIN_STAFF}
      roles={ROLE_DEFINITIONS}
      groups={PERMISSION_GROUPS}
    />
  )
}
