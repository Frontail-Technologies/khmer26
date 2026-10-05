"use client"

import Link from "next/link"
import { ArrowRight, ListBullets, SealCheck, WarningCircle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAdminDashboard } from "../hooks/dashboard.queries"

export function AdminModerationQueue() {
  const { data } = useAdminDashboard()
  const queue = data?.moderationQueue ?? []

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Moderation Queue
          </CardTitle>
          <Badge variant="destructive" className="h-4.5 px-2 text-[9px] font-bold rounded-md">
            {queue.length} Pending
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

      <CardContent className="p-0 divide-y divide-border/60">
        {queue.map((item) => {
          const isUrgent = item.priority === "urgent"
          const isHigh = item.priority === "high"

          return (
            <div
              key={`${item.type}-${item.id}`}
              className="p-3.5 sm:p-4 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={cn(
                    "size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border",
                    item.type === "report"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : item.type === "verification"
                      ? "bg-accent/10 text-accent border-accent/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  {item.type === "report" ? (
                    <WarningCircle size={17} weight="fill" />
                  ) : item.type === "verification" ? (
                    <SealCheck size={17} weight="fill" />
                  ) : (
                    <ListBullets size={17} weight="bold" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-foreground truncate">
                      {item.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1.5 py-0 uppercase font-bold h-4 rounded",
                        isUrgent
                          ? "border-destructive/40 text-destructive bg-destructive/5"
                          : isHigh
                          ? "border-accent/40 text-accent bg-accent/5"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(item.submittedAt))}
                </span>
                <Link
                  href={item.href}
                  className="text-xs font-bold text-primary hover:underline mt-0.5 inline-block"
                >
                  Review
                </Link>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
