import type { Metadata } from "next"
import { ReportSummaryMetrics } from "@/features/admin/reports/components/report-summary-metrics"
import { ReportTable } from "@/features/admin/reports/components/report-table"
import { DEMO_REPORT_STATS } from "@/features/admin/reports/data/demo-report-stats"
import { DEMO_ADMIN_REPORTS } from "@/features/admin/reports/data/demo-admin-reports"

export const metadata: Metadata = {
  title: "Reports Moderation",
  description: "Review, investigate and resolve marketplace community reports across Cambodia.",
}

export default function AdminReportsPage() {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <ReportSummaryMetrics stats={DEMO_REPORT_STATS} />
      <ReportTable initialData={DEMO_ADMIN_REPORTS} />
    </div>
  )
}
