import type { Metadata } from "next"
import { ReportTable } from "@/features/admin/reports/components/report-table"

export const metadata: Metadata = {
  title: "Reports Moderation",
  description: "Review, investigate and resolve marketplace community reports across Cambodia.",
}

export default function AdminReportsPage() {
  return (
    <div className="w-full">
      <ReportTable />
    </div>
  )
}
