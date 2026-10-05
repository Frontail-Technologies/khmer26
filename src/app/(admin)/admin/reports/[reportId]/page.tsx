import type { Metadata } from "next"
import { ReportDetailLoader } from "@/features/admin/reports/components/report-detail-loader"

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

  return <ReportDetailLoader reportId={reportId} />
}
