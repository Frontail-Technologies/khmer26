"use client"

import { useState } from "react"
import { TrendUp, CaretRight } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

const TIME_RANGES = [
  { id: "12m", label: "This Year" },
  { id: "30d", label: "Last 30 Days" },
  { id: "7d", label: "7 Days" },
]

const MONTHLY_DATA = [
  { month: "Jan", listings: 3200, height: "45%", revenue: "$32k" },
  { month: "Feb", listings: 3800, height: "54%", revenue: "$38k" },
  { month: "Mar", listings: 4100, height: "58%", revenue: "$41k" },
  { month: "Apr", listings: 4600, height: "65%", revenue: "$46k" },
  { month: "May", listings: 5200, height: "74%", revenue: "$52k" },
  { month: "Jun", listings: 4900, height: "70%", revenue: "$49k" },
  { month: "Jul", listings: 5800, height: "82%", revenue: "$58k" },
  { month: "Aug", listings: 6400, height: "90%", revenue: "$64k" },
  { month: "Sep", listings: 6100, height: "86%", revenue: "$61k" },
  { month: "Oct", listings: 6900, height: "98%", revenue: "$69k" },
  { month: "Nov", listings: 6700, height: "94%", revenue: "$67k" },
  { month: "Dec", listings: 7100, height: "100%", revenue: "$71k" },
]

export function AdminOverviewPanel() {
  const [activeRange, setActiveRange] = useState("12m")

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Marketplace Activity
          </CardTitle>
          <Badge variant="secondary" className="text-[10px] font-bold h-4.5 px-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-md">
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
                48,290 Ads
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <TrendUp size={12} weight="bold" />
                <span>+12.4%</span>
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
            {MONTHLY_DATA.map((item, index) => {
              const isLatest = index === MONTHLY_DATA.length - 1
              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group/bar relative"
                >
                  <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-7 text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded shadow-sm transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.revenue}
                  </div>
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-300",
                      isLatest
                        ? "bg-primary shadow-xs"
                        : "bg-primary/25 group-hover/bar:bg-primary/50 dark:bg-primary/30 dark:group-hover/bar:bg-primary/60"
                    )}
                    style={{ height: item.height }}
                  />
                  <span className="text-[10px] text-muted-foreground mt-2 font-semibold">
                    {item.month}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                <span className="font-medium text-foreground">Subscriptions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary/30" />
                <span className="font-medium text-foreground">Feature Ads</span>
              </div>
            </div>
            <span className="font-medium text-xs">Avg 160 ads / day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
