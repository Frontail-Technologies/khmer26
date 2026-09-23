import { ClockCounterClockwise, CheckCircle } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AdminReportAuditEvent } from "../types"

interface ReportHistoryTimelineProps {
  history: AdminReportAuditEvent[]
}

export function ReportHistoryTimeline({ history }: ReportHistoryTimelineProps) {
  return (
    <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
      <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-6.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ClockCounterClockwise size={14} weight="bold" />
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
              Report Audit History
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Immutable ledger of case transitions and actions
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-semibold">
          {history.length} {history.length === 1 ? "Event" : "Events"}
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4">
        <div className="relative pl-5 border-l border-border/70 space-y-4 ml-2 my-1">
          {history.map((evt) => (
            <div key={evt.id} className="relative space-y-1 text-xs">
              <div className="absolute -left-[27px] top-0.5 size-3.5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <CheckCircle size={8} weight="fill" className="text-primary" />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-foreground">{evt.action}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {evt.timestamp}
                </span>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {evt.details}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="font-semibold text-foreground">{evt.actor}</span>
                <span>•</span>
                <span>{evt.actorRole}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
