import type { Metadata } from "next"
import { ReportReasonsTable } from "@/features/admin/reports/components/report-reasons-table"
import { DEMO_REPORT_REASONS } from "@/features/admin/reports/data/demo-report-reasons"

export const metadata: Metadata = {
  title: "Report Reasons",
  description: "Manage reasons and categories available for user reporting.",
}

export default function AdminReportReasonsPage() {
  return (
    <div className="w-full">
      <ReportReasonsTable initialData={DEMO_REPORT_REASONS} />
    </div>
  )
}
