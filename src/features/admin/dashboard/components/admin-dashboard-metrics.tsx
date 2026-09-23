import Link from "next/link"
import {
  Users,
  Crown,
  SealCheck,
  Star,
  TrendUp,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AdminDashboardMetrics() {
  const kpis = [
    {
      id: "all-users",
      label: "All Users",
      value: "124,500",
      change: "+18.2%",
      trend: "up",
      icon: Users,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      href: "/admin/users",
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      value: "917",
      change: "+6.5%",
      trend: "up",
      icon: Crown,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      href: "/admin/subscriptions",
    },
    {
      id: "pending-verifications",
      label: "Verifications",
      value: "5",
      change: "Action required",
      trend: "alert",
      icon: SealCheck,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      href: "/admin/verifications",
      urgent: true,
    },
    {
      id: "total-reviews",
      label: "Total Reviews",
      value: "3,420",
      change: "4.9 Avg Star",
      trend: "neutral",
      icon: Star,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      href: "/admin/reviews",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-3.5 h-full">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Link
            key={kpi.id}
            href={kpi.href}
            className="block group/kpi h-full"
          >
            <Card className="rounded-xl border-0 bg-card hover:bg-muted/30 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "size-9 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover/kpi:scale-105",
                    kpi.color
                  )}
                >
                  <Icon size={18} weight="bold" />
                </div>
                <CaretRight size={13} className="text-muted-foreground/40 group-hover/kpi:text-primary group-hover/kpi:translate-x-0.5 transition-all" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block truncate">
                  {kpi.label}
                </span>
                <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight block">
                  {kpi.value}
                </span>
              </div>

              <div className="pt-0.5 flex items-center gap-1 text-xs font-medium">
                {kpi.trend === "up" ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <TrendUp size={12} weight="bold" />
                    <span>{kpi.change}</span>
                  </span>
                ) : kpi.urgent ? (
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                    {kpi.change}
                  </span>
                ) : (
                  <span className="text-muted-foreground font-semibold text-xs">
                    {kpi.change}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
