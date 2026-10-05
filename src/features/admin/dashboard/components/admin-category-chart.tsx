"use client"

import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const formatCount = (value?: number) => (value ?? 0).toLocaleString()

export function AdminCategoryChart() {
  const { data } = useAdminDashboard()
  const totalActiveListings = data?.listings?.active ?? 0
  const categories = (data?.topCategories ?? []).slice(0, 4).map((cat) => ({
    id: cat.categoryId,
    name: cat.nameEn,
    count: cat.activeListings,
    percent: totalActiveListings > 0 ? Math.round((cat.activeListings / totalActiveListings) * 100) : 0,
  }))
  const listingTotal = Math.max(data?.listings?.total ?? 0, 1)
  const statusSummary = [
    { label: "Active", count: data?.listings?.active ?? 0, percent: ((data?.listings?.active ?? 0) / listingTotal) * 100, color: "bg-primary" },
    { label: "Pending", count: data?.listings?.pendingReview ?? 0, percent: ((data?.listings?.pendingReview ?? 0) / listingTotal) * 100, color: "bg-accent" },
    { label: "Flagged", count: data?.listings?.flagged ?? 0, percent: ((data?.listings?.flagged ?? 0) / listingTotal) * 100, color: "bg-destructive" },
    { label: "Expired", count: data?.listings?.expired ?? 0, percent: ((data?.listings?.expired ?? 0) / listingTotal) * 100, color: "bg-muted-foreground" },
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
          {categories.map((cat, index) => (
            <div key={cat.id || `${cat.name}-${index}`} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">{cat.name}</span>
                <span className="text-muted-foreground font-medium text-[11px]">
                  {formatCount(cat.count)} ({cat.percent}%)
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
                title={`${s.label}: ${formatCount(s.count)}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1.5">
            {statusSummary.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className={`size-2 rounded-full ${s.color} shrink-0`} />
                <span className="text-muted-foreground">{s.label}:</span>
                <span className="font-bold text-foreground">{formatCount(s.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
