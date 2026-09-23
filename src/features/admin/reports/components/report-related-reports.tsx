import Link from "next/link"
import { ArrowsClockwise, CaretRight, WarningCircle } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { DEMO_ADMIN_REPORTS } from "../data/demo-admin-reports"
import type { AdminReportStatus } from "../types"

interface ReportRelatedReportsProps {
  currentReportId: string
  targetId: string
  relatedReportIds?: string[]
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

export function ReportRelatedReports({
  currentReportId,
  targetId,
  relatedReportIds = [],
}: ReportRelatedReportsProps) {
  const relatedReports = DEMO_ADMIN_REPORTS.filter(
    (r) =>
      r.id !== currentReportId &&
      (r.target.id.toLowerCase() === targetId.toLowerCase() ||
        relatedReportIds.includes(r.id))
  )

  if (relatedReports.length === 0) {
    return null
  }

  return (
    <Card className="rounded-xl border border-border/70 bg-card p-0 shadow-none overflow-hidden">
      <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-6.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ArrowsClockwise size={14} weight="bold" />
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
              Related Reports on Target ({targetId})
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Additional community reports associated with this entity
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-semibold gap-1 text-amber-600 dark:text-amber-400 border-amber-500/30">
          <WarningCircle size={11} weight="fill" />
          <span>{relatedReports.length} Related</span>
        </Badge>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60">
        {relatedReports.map((item) => (
          <Link
            key={item.id}
            href={`/admin/reports/${item.id}`}
            className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors group"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.id}
                </span>
                <Badge variant="outline" className="text-[9px] font-bold uppercase">
                  {item.priority}
                </Badge>
                <StatusBadge
                  label={STATUS_LABEL_MAP[item.status]}
                  tone={STATUS_TONE_MAP[item.status]}
                  size="sm"
                />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {item.reasonLabel}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                Reported {item.createdAt} by {item.reporter.name}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary shrink-0 font-semibold">
              <span>View</span>
              <CaretRight size={13} weight="bold" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
