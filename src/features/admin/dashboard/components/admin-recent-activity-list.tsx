import Link from "next/link"
import { ArrowRight, Clock } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DEMO_RECENT_ACTIVITIES } from "../../data/demo-admin-dashboard"

export function AdminRecentActivityList() {
  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-0.5">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Audit Activity
          </CardTitle>
        </div>

        <Link
          href="/admin/audit-log"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Full Log</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {DEMO_RECENT_ACTIVITIES.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            <div className="size-6 rounded-full bg-muted/80 flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground border border-border/60">
              <Clock size={13} weight="bold" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-foreground leading-snug">
                <span className="font-bold text-foreground">{act.adminName}</span>{" "}
                <span className="text-muted-foreground">{act.action}</span>{" "}
                <span className="font-semibold text-primary">{act.target}</span>
              </p>
              <span className="text-[10px] text-muted-foreground/80 font-medium">
                {act.timestamp}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
