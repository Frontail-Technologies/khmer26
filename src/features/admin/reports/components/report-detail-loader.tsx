"use client"

import { notFound } from "next/navigation"
import { useAdminReportDetail } from "../hooks/reports.queries"
import { ReportDetailView } from "./report-detail-view"

interface ReportDetailLoaderProps {
  reportId: string
}

export function ReportDetailLoader({ reportId }: ReportDetailLoaderProps) {
  const { data: report, isLoading, isError } = useAdminReportDetail(reportId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-xs text-muted-foreground">
        Loading report...
      </div>
    )
  }

  if (isError || !report) {
    notFound()
  }

  return <ReportDetailView report={report} />
}
