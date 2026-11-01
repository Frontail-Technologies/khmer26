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

  return (
    <Card className="rounded-2xl border border-border/60 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold text-foreground">
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
                <span className="text-muted-foreground font-medium text-xxs">
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

      </CardContent>
    </Card>
  )
}
