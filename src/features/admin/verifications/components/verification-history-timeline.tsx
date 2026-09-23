import { Clock, UserCircle, CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VerificationAuditEvent } from "../types"

interface VerificationHistoryTimelineProps {
  history: VerificationAuditEvent[]
}

export function VerificationHistoryTimeline({ history }: VerificationHistoryTimelineProps) {
  return (
    <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60">
        <CardTitle className="text-sm sm:text-base font-bold text-foreground">
          Review & Audit History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="space-y-4">
          {history.map((event, index) => {
            const isApproved = event.action.toLowerCase().includes("approved")
            const isRejected = event.action.toLowerCase().includes("rejected")

            return (
              <div key={event.id || index} className="flex items-start gap-3 text-xs relative">
                <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground border border-border/60">
                  {isApproved ? (
                    <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" weight="fill" />
                  ) : isRejected ? (
                    <XCircle size={14} className="text-destructive" weight="fill" />
                  ) : (
                    <Clock size={12} />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-foreground font-medium leading-snug">
                    {event.action}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground/80">
                      <UserCircle size={12} />
                      <span>{event.actor}</span>
                    </span>
                    <span>•</span>
                    <span>{event.timestamp}</span>
                  </div>

                  {event.note && (
                    <div className="mt-1.5 p-2 rounded-md bg-muted/40 text-[11px] text-muted-foreground border border-border/50">
                      <span className="font-semibold text-foreground">Note: </span>
                      <span>{event.note}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
