import type { Metadata } from "next"
import { UserTable } from "@/features/admin/users/components/user-table"

export const metadata: Metadata = {
  title: "Users & Sellers",
  description: "Manage marketplace accounts, profiles, and seller activity.",
}

export default function AdminUsersPage() {
  return (
    <div className="w-full">
      <UserTable />
    </div>
  )
}
