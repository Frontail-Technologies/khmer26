import Link from "next/link"
import { Warning, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DEMO_ADMIN_REPORTS } from "@/features/admin/reports/data/demo-admin-reports"
import { cn } from "@/lib/utils"

export function AdminRecentReportsCard() {
  const recentReports = DEMO_ADMIN_REPORTS.slice(0, 4)

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Recent Safety Reports
          </CardTitle>
          <Badge variant="destructive" className="h-4.5 px-2 text-[9px] font-bold rounded-md">
            {recentReports.length} Flagged
          </Badge>
        </div>

        <Link
          href="/admin/reports"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60 flex-1">
        {recentReports.map((rpt) => {
          const isUrgent = rpt.priority === "urgent"
          const isHigh = rpt.priority === "high"

          return (
            <div
              key={rpt.id}
              className="p-3.5 sm:p-4 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="size-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
                  <Warning size={16} weight="fill" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                      {rpt.target.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1.5 py-0 uppercase font-bold h-4 rounded",
                        isUrgent
                          ? "border-destructive/40 text-destructive bg-destructive/5"
                          : isHigh
                          ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {rpt.priority}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground truncate">
                    {rpt.reasonLabel} • Reported by <span className="font-medium text-foreground">{rpt.reporter.name}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">
                  {rpt.createdAt}
                </span>
                <Link
                  href={`/admin/reports/${rpt.id}`}
                  className="text-xs font-bold text-primary hover:underline mt-0.5 inline-block"
                >
                  Investigate
                </Link>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
