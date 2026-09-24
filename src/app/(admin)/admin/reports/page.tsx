import type { Metadata } from "next"
import { ReportTable } from "@/features/admin/reports/components/report-table"
import { DEMO_ADMIN_REPORTS } from "@/features/admin/reports/data/demo-admin-reports"

export const metadata: Metadata = {
  title: "Reports Moderation",
  description: "Review, investigate and resolve marketplace community reports across Cambodia.",
}

export default function AdminReportsPage() {
  return (
    <div className="w-full">
      <ReportTable initialData={DEMO_ADMIN_REPORTS} />
    </div>
  )
}
