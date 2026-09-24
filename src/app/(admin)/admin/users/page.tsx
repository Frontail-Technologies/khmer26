import type { Metadata } from "next"
import { UserTable } from "@/features/admin/users/components/user-table"
import { DEMO_ADMIN_USERS } from "@/features/admin/users/data/demo-admin-users"

export const metadata: Metadata = {
  title: "Users & Sellers",
  description: "Manage marketplace accounts, profiles, and seller activity.",
}

export default function AdminUsersPage() {
  return (
    <div className="w-full">
      <UserTable initialData={DEMO_ADMIN_USERS} />
    </div>
  )
}
