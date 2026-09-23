import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Flag } from "@phosphor-icons/react/dist/ssr"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { ReportTargetSummary } from "@/features/admin/reports/components/report-target-summary"
import { ReportReporterStatement } from "@/features/admin/reports/components/report-reporter-statement"
import { ReportEvidenceViewer } from "@/features/admin/reports/components/report-evidence-viewer"
import { ReportRelatedReports } from "@/features/admin/reports/components/report-related-reports"
import { ReportInternalNotes } from "@/features/admin/reports/components/report-internal-notes"
import { ReportHistoryTimeline } from "@/features/admin/reports/components/report-history-timeline"
import { ReportCasePanel } from "@/features/admin/reports/components/report-case-panel"
import { DEMO_ADMIN_REPORTS } from "@/features/admin/reports/data/demo-admin-reports"
import type { AdminReportStatus } from "@/features/admin/reports/types"
import { cn } from "@/lib/utils"

interface AdminReportDetailPageProps {
  params: Promise<{ reportId: string }>
}

const STATUS_TONE_MAP: Record<AdminReportStatus, StatusTone> = {
  open: "warning",
  in_review: "info",
  resolved: "success",
  dismissed: "neutral",
  escalated: "destructive",
}

const STATUS_LABEL_MAP: Record<AdminReportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
  escalated: "Escalated",
}

export async function generateMetadata({
  params,
}: AdminReportDetailPageProps): Promise<Metadata> {
  const { reportId } = await params
  return {
    title: `Report Review #${reportId}`,
    description: `Administrative report review and moderation workspace for case #${reportId}`,
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

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-0.5"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Back to Reports</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                <Flag size={16} weight="fill" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-mono">
                {report.id}
              </h1>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold px-2 py-0 h-5 uppercase tracking-wide",
                report.priority === "urgent"
                  ? "bg-destructive/10 text-destructive border-destructive/30"
                  : report.priority === "high"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-muted/60 text-muted-foreground border-border"
              )}
            >
              {report.priority} Priority
            </Badge>

            <StatusBadge
              label={STATUS_LABEL_MAP[report.status]}
              tone={STATUS_TONE_MAP[report.status]}
              size="sm"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Reported {report.createdDate} • Target:{" "}
            <span className="font-semibold text-foreground capitalize">
              {report.targetType} · {report.target.id}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <ReportTargetSummary target={report.target} />

          <ReportReporterStatement report={report} />

          <ReportEvidenceViewer evidence={report.evidence} />

          <ReportRelatedReports
            currentReportId={report.id}
            targetId={report.target.id}
            relatedReportIds={report.relatedReportIds}
          />

          <ReportInternalNotes notes={report.internalNotes} />

          <ReportHistoryTimeline history={report.history} />
        </div>

        <div className="lg:col-span-4">
          <ReportCasePanel report={report} />
        </div>
      </div>
    </div>
  )
}
