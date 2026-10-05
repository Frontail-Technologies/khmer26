import type { Metadata } from "next"
import { ReportReasonsTable } from "@/features/admin/reports/components/report-reasons-table"

export const metadata: Metadata = {
  title: "Report Reasons",
  description: "Manage reasons and categories available for user reporting.",
}

export default function AdminReportReasonsPage() {
  return (
    <div className="w-full">
      <ReportReasonsTable />
    </div>
  )
}
