import type { Metadata } from "next"
import { RolesWorkspace } from "@/features/admin/roles/components/roles-workspace"

export const metadata: Metadata = {
  title: "Admin Roles",
  description: "Manage Admin access and roles.",
}

export default function AdminRolesPage() {
  return (
    <RolesWorkspace />
  )
}
