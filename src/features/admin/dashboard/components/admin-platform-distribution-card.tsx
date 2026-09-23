import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DEMO_SELLER_DISTRIBUTION, DEMO_SUBSCRIPTION_DISTRIBUTION } from "../../data/demo-admin-dashboard"

export function AdminPlatformDistributionCard() {
  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Seller & Tier Breakdown
          </CardTitle>
        </div>

        <Link
          href="/admin/subscriptions"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Plans</span>
          <CaretRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Seller Account Types</span>
            <span className="text-[11px] text-muted-foreground font-mono">3,700 total accounts</span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-muted/60 flex overflow-hidden">
            {DEMO_SELLER_DISTRIBUTION.map((item) => (
              <div
                key={item.label}
                className={item.color}
                style={{ width: `${item.percent}%` }}
                title={`${item.label}: ${item.count} (${item.percent}%)`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {DEMO_SELLER_DISTRIBUTION.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs">
                <span className={`size-2 rounded-full ${item.color} shrink-0`} />
                <span className="text-muted-foreground truncate">{item.label}:</span>
                <span className="font-bold text-foreground shrink-0">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Active Subscription Packages</span>
            <span className="text-[11px] text-primary font-bold font-mono">$110.0k ARR</span>
          </div>

          <div className="space-y-2">
            {DEMO_SUBSCRIPTION_DISTRIBUTION.map((sub) => (
              <div key={sub.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px] truncate">{sub.label}</span>
                  <span className="font-bold text-foreground text-[11px]">{sub.count} ({sub.percent}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full bg-primary/80 rounded-full transition-all duration-500"
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
