import { ClockCounterClockwise, User } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { AdminListingAuditEvent } from "../types"

interface ListingModerationHistoryProps {
  history: AdminListingAuditEvent[]
}

export function ListingModerationHistory({ history }: ListingModerationHistoryProps) {
  if (history.length === 0) {
    return null
  }

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden space-y-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60">
        <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
          <ClockCounterClockwise size={18} className="text-primary" />
          <span>Moderation Audit Trail</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/70">
          {history.map((event) => (
            <div key={event.id} className="relative space-y-1 text-xs">
              <div className="absolute -left-6 top-0.5 size-5 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                <div className="size-1.5 rounded-full bg-primary" />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-foreground">{event.action}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{event.timestamp}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <User size={12} />
                <span>
                  {event.actor} <span className="text-muted-foreground/60">({event.actorRole})</span>
                </span>
              </div>

              {event.reason && (
                <p className="text-xs font-semibold text-destructive">
                  Reason: {event.reason}
                </p>
              )}

              {event.details && (
                <p className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded-md border border-border/40 leading-relaxed">
                  {event.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
