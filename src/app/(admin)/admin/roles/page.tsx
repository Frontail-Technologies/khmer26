import type { Metadata } from "next"
import { RolesWorkspace } from "@/features/admin/roles/components/roles-workspace"
import {
  DEMO_ADMIN_STAFF,
  DEMO_ROLE_DEFINITIONS,
} from "@/features/admin/roles/data/demo-roles-data"

export const metadata: Metadata = {
  title: "Admin Roles",
  description: "Manage Admin access and roles.",
}

export default function AdminRolesPage() {
  return (
    <RolesWorkspace
      initialStaff={DEMO_ADMIN_STAFF}
      initialRoles={DEMO_ROLE_DEFINITIONS}
    />
  )
}
