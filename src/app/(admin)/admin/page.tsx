import type { Metadata } from "next"
import { AdminKpiRibbon } from "@/features/admin/dashboard/components/admin-kpi-ribbon"
import { AdminOverviewPanel } from "@/features/admin/dashboard/components/admin-overview-panel"
import { AdminDashboardMetrics } from "@/features/admin/dashboard/components/admin-dashboard-metrics"
import { AdminRecentListingsTable } from "@/features/admin/dashboard/components/admin-recent-listings-table"
import { AdminCategoryChart } from "@/features/admin/dashboard/components/admin-category-chart"
import { AdminModerationQueue } from "@/features/admin/dashboard/components/admin-moderation-queue"
import { AdminRecentActivityList } from "@/features/admin/dashboard/components/admin-recent-activity-list"
import { AdminRecentReportsCard } from "@/features/admin/dashboard/components/admin-recent-reports-card"
import { AdminReportedChatsCard } from "@/features/admin/dashboard/components/admin-reported-chats-card"
import { AdminTopSellersCard } from "@/features/admin/dashboard/components/admin-top-sellers-card"
import { AdminPlatformDistributionCard } from "@/features/admin/dashboard/components/admin-platform-distribution-card"

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "Khmer26 Marketplace Administrator Operations and Overview.",
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <AdminKpiRibbon />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 xl:col-span-7">
          <AdminOverviewPanel />
        </div>
        <div className="lg:col-span-5 xl:col-span-5">
          <AdminDashboardMetrics />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 xl:col-span-7">
          <AdminRecentListingsTable />
        </div>
        <div className="lg:col-span-5 xl:col-span-5">
          <AdminCategoryChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6">
          <AdminModerationQueue />
        </div>
        <div className="lg:col-span-6">
          <AdminRecentActivityList />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6">
          <AdminRecentReportsCard />
        </div>
        <div className="lg:col-span-6">
          <AdminReportedChatsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6">
          <AdminTopSellersCard />
        </div>
        <div className="lg:col-span-6">
          <AdminPlatformDistributionCard />
        </div>
      </div>
    </div>
  )
}
