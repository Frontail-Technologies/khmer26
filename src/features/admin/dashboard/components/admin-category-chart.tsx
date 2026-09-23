import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DEMO_CATEGORY_DISTRIBUTION } from "../../data/demo-admin-dashboard"

export function AdminCategoryChart() {
  const statusSummary = [
    { label: "Active", count: "48,290", percent: 84, color: "bg-emerald-500" },
    { label: "Pending", count: "42", percent: 6, color: "bg-amber-500" },
    { label: "Reported", count: "8", percent: 2, color: "bg-destructive" },
    { label: "Expired", count: "1,204", percent: 8, color: "bg-muted-foreground" },
  ]

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Category Breakdown
          </CardTitle>
        </div>

        <Link
          href="/admin/categories"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>All</span>
          <CaretRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {DEMO_CATEGORY_DISTRIBUTION.slice(0, 4).map((cat) => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">{cat.name}</span>
                <span className="text-muted-foreground font-medium text-[11px]">
                  {cat.count.toLocaleString()} ({cat.percent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/60 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Listing Health Status
          </span>
          <div className="h-2 w-full rounded-full bg-muted/60 flex overflow-hidden">
            {statusSummary.map((s) => (
              <div
                key={s.label}
                className={s.color}
                style={{ width: `${s.percent}%` }}
                title={`${s.label}: ${s.count}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1.5">
            {statusSummary.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className={`size-2 rounded-full ${s.color} shrink-0`} />
                <span className="text-muted-foreground">{s.label}:</span>
                <span className="font-bold text-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
