import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ReportDetailView } from "@/features/admin/reports/components/report-detail-view"
import { DEMO_ADMIN_REPORTS } from "@/features/admin/reports/data/demo-admin-reports"

interface AdminReportDetailPageProps {
  params: Promise<{ reportId: string }>
}

export async function generateMetadata({
  params,
}: AdminReportDetailPageProps): Promise<Metadata> {
  const { reportId } = await params
  return {
    title: `Report #${reportId}`,
    description: `Administrative report review and resolution workspace for case #${reportId}`,
  }
}

export default async function AdminReportDetailPage({
  params,
}: AdminReportDetailPageProps) {
  const { reportId } = await params

  const report =
    DEMO_ADMIN_REPORTS.find((r) => r.id.toLowerCase() === reportId.toLowerCase()) ||
    DEMO_ADMIN_REPORTS[0]

  if (!report) {
    notFound()
  }

  return <ReportDetailView report={report} />
}
