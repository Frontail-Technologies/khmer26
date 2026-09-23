import {
  ChatText,
  User,
  ShieldCheck,
  CalendarCheck,
  Devices,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AdminReport } from "../types"

interface ReportReporterStatementProps {
  report: AdminReport
}

export function ReportReporterStatement({ report }: ReportReporterStatementProps) {
  const reporter = report.reporter

  return (
    <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
      <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-6.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ChatText size={14} weight="bold" />
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
              Reporter Claim & Statement
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Community allegation submitted for moderator evaluation
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-semibold">
          Subject to Review
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <User size={11} />
              <span>Reported By</span>
            </span>
            <p className="font-semibold text-foreground truncate">{reporter.name}</p>
            <span className="text-[10px] text-muted-foreground capitalize block">
              {reporter.accountType} account
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <CalendarCheck size={11} />
              <span>Submitted</span>
            </span>
            <p className="font-semibold text-foreground">{report.createdAt}</p>
            <span className="text-[10px] text-muted-foreground block truncate">
              {report.createdDate}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Devices size={11} />
              <span>Source Surface</span>
            </span>
            <p className="font-semibold text-foreground truncate">
              {report.sourceSurface || "Marketplace App"}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              In-app report entry
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={11} />
              <span>Privacy Level</span>
            </span>
            <p className="font-semibold text-foreground">
              {reporter.isProtected ? "Protected Reporter" : "Standard Verified"}
            </p>
            <span className="text-[10px] text-muted-foreground block">
              {reporter.email || "Confidential Contact"}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Reported Reason Category
          </span>
          <div className="p-2.5 rounded-lg bg-card border border-border/70 text-xs font-semibold text-foreground">
            {report.reasonLabel}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Reporter Detailed Statement
          </span>
          <div className="p-3.5 rounded-xl bg-card border border-border/70 text-xs text-foreground leading-relaxed">
            &ldquo;{report.statement}&rdquo;
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
