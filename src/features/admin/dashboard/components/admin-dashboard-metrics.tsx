"use client"

import Link from "next/link"
import {
  Users,
  Crown,
  SealCheck,
  ChatCircleDots,
  TrendUp,
  CaretRight,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const formatCount = (value?: number) => (value ?? 0).toLocaleString()

export function AdminDashboardMetrics() {
  const { data } = useAdminDashboard()

  const kpis = [
    {
      id: "all-users",
      label: "All Users",
      value: formatCount(data?.users?.total),
      change: `${formatCount(data?.users?.newLast7Days)} new in 7d`,
      trend: "up",
      icon: Users,
      color: "bg-primary/10 text-primary border-primary/20",
      href: "/admin/users",
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      value: formatCount(data?.subscriptions?.active),
      change: `${formatCount(data?.subscriptions?.expiringSoon)} expiring soon`,
      trend: "up",
      icon: Crown,
      color: "bg-accent/10 text-accent border-accent/20",
      href: "/admin/subscriptions",
    },
    {
      id: "pending-verifications",
      label: "Verifications",
      value: formatCount(data?.sellers?.pendingVerification),
      change: "Action required",
      trend: "alert",
      icon: SealCheck,
      color: "bg-destructive/10 text-destructive border-destructive/20",
      href: "/admin/verifications",
      urgent: true,
    },
    {
      id: "messages-today",
      label: "Messages Today",
      value: formatCount(data?.chat?.messagesToday),
      change: `${formatCount(data?.chat?.offersPending)} offers pending`,
      trend: "neutral",
      icon: ChatCircleDots,
      color: "bg-accent/10 text-accent border-accent/20",
      href: "/admin/chats",
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
                  <span className="inline-flex items-center gap-0.5 text-primary font-bold text-xs">
                    <TrendUp size={12} weight="bold" />
                    <span>{kpi.change}</span>
                  </span>
                ) : kpi.urgent ? (
                  <span className="font-bold text-destructive text-xs">
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
