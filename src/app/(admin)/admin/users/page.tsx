import type { Metadata } from "next"
import { UserSummaryMetrics } from "@/features/admin/users/components/user-summary-metrics"
import { UserTable } from "@/features/admin/users/components/user-table"
import { DEMO_USER_STATS } from "@/features/admin/users/data/demo-user-stats"
import { DEMO_ADMIN_USERS } from "@/features/admin/users/data/demo-admin-users"

export const metadata: Metadata = {
  title: "Users & Sellers",
  description: "Manage marketplace accounts, profiles and seller activity.",
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <UserSummaryMetrics stats={DEMO_USER_STATS} />
      <UserTable initialData={DEMO_ADMIN_USERS} />
    </div>
  )
}
