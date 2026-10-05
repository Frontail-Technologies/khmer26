"use client"

import { useState } from "react"
import { CaretRight } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const TIME_RANGES = [
  { id: "12m", label: "This Year" },
  { id: "30d", label: "Last 30 Days" },
  { id: "7d", label: "7 Days" },
]

const formatCount = (value?: number) => (value ?? 0).toLocaleString()
const formatMoney = (value?: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value ?? 0)

export function AdminOverviewPanel() {
  const [activeRange, setActiveRange] = useState("12m")
  const { data } = useAdminDashboard()
  const listingStats = [
    { label: "Active", value: data?.listings?.active ?? 0, tone: "bg-primary" },
    { label: "Pending", value: data?.listings?.pendingReview ?? 0, tone: "bg-accent" },
    { label: "Flagged", value: data?.listings?.flagged ?? 0, tone: "bg-destructive" },
    { label: "Sold", value: data?.listings?.sold ?? 0, tone: "bg-success" },
    { label: "Expired", value: data?.listings?.expired ?? 0, tone: "bg-muted-foreground" },
  ]
  const maxListingValue = Math.max(...listingStats.map((item) => item.value), 1)

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Marketplace Activity
          </CardTitle>
          <Badge variant="secondary" className="text-[10px] font-bold h-4.5 px-2 bg-success/10 text-success border-success/20 rounded-md">
            Live Feed
          </Badge>
        </div>

        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg self-start sm:self-auto border border-border/50">
          {TIME_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setActiveRange(range.id)}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                activeRange === range.id
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Marketplace Volume
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {formatCount(data?.listings?.total)} Listings
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-success">
                <span>{formatMoney(data?.revenue?.last30Days)} 30d revenue</span>
              </span>
            </div>
          </div>

          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>Manage All Listings</span>
            <CaretRight size={12} weight="bold" />
          </Link>
        </div>

        <div className="pt-1">
          <div className="h-40 sm:h-48 w-full flex items-end gap-1.5 sm:gap-2.5 pt-4 pb-2 border-b border-border/60">
            {listingStats.map((item, index) => {
              const isLatest = index === 0
              return (
                <div
                  key={item.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group/bar relative"
                >
                  <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-7 text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded shadow-sm transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {formatCount(item.value)}
                  </div>
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-300",
                      isLatest
                        ? "bg-primary shadow-xs"
                        : `${item.tone} opacity-70 group-hover/bar:opacity-80`
                    )}
                    style={{ height: `${Math.max((item.value / maxListingValue) * 100, item.value > 0 ? 8 : 2)}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground mt-2 font-semibold">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                <span className="font-medium text-foreground">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent" />
                <span className="font-medium text-foreground">Pending</span>
              </div>
            </div>
            <span className="font-medium text-xs">{formatCount(data?.listings?.total)} total listings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
