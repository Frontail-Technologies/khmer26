"use client"

import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const formatCount = (value?: number) => (value ?? 0).toLocaleString()

export function AdminPlatformDistributionCard() {
  const { data } = useAdminDashboard()
  const sellerTotal = Math.max(data?.sellers?.total ?? 0, 1)
  const sellerDistribution = [
    {
      label: "Verified",
      count: data?.sellers?.verified ?? 0,
      percent: Math.round(((data?.sellers?.verified ?? 0) / sellerTotal) * 100),
      color: "bg-primary",
    },
    {
      label: "Pending",
      count: data?.sellers?.pendingVerification ?? 0,
      percent: Math.round(((data?.sellers?.pendingVerification ?? 0) / sellerTotal) * 100),
      color: "bg-accent",
    },
    {
      label: "Other",
      count: Math.max((data?.sellers?.total ?? 0) - (data?.sellers?.verified ?? 0) - (data?.sellers?.pendingVerification ?? 0), 0),
      percent: Math.round((Math.max((data?.sellers?.total ?? 0) - (data?.sellers?.verified ?? 0) - (data?.sellers?.pendingVerification ?? 0), 0) / sellerTotal) * 100),
      color: "bg-muted-foreground",
    },
  ]
  const subscriptionTotal = Math.max(data?.subscriptions?.active ?? 0, 1)

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
            <span className="font-bold text-foreground">Seller Verification</span>
            <span className="text-[11px] text-muted-foreground font-mono">{formatCount(data?.sellers?.total)} total accounts</span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-muted/60 flex overflow-hidden">
            {sellerDistribution.map((item) => (
              <div
                key={item.label}
                className={item.color}
                style={{ width: `${item.percent}%` }}
                title={`${item.label}: ${item.count} (${item.percent}%)`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {sellerDistribution.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs">
                <span className={`size-2 rounded-full ${item.color} shrink-0`} />
                <span className="text-muted-foreground truncate">{item.label}:</span>
                <span className="font-bold text-foreground shrink-0">{formatCount(item.count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Active Subscription Packages</span>
            <span className="text-[11px] text-primary font-bold font-mono">{formatCount(data?.subscriptions?.active)} active</span>
          </div>

          <div className="space-y-2">
            {(data?.subscriptions?.planDistribution ?? []).map((plan) => {
              const percent = Math.round((plan.count / subscriptionTotal) * 100)
              return (
                <div key={plan.planId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px] truncate">{plan.planName}</span>
                    <span className="font-bold text-foreground text-[11px]">{formatCount(plan.count)} ({percent}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
