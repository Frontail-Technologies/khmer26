"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const formatAction = (value: string) => value.replace(/[._-]/g, " ")

export function AdminRecentActivityList() {
  const { data } = useAdminDashboard()
  const activities = data?.recentActivity ?? []

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-0.5">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Audit Activity
          </CardTitle>
        </div>

        <Link
          href="/admin/audit-log"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Full Log</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-xs">
            <div className="size-6 rounded-full bg-muted/80 flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground border border-border/60">
              <Clock size={13} weight="bold" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-foreground leading-snug">
                <span className="font-bold text-foreground">{activity.actorEmail ?? "Admin"}</span>{" "}
                <span className="text-muted-foreground">{formatAction(activity.action)}</span>{" "}
                <span className="font-semibold text-primary">{activity.targetType} {activity.targetId ?? ""}</span>
              </p>
              <span className="text-[10px] text-muted-foreground/80 font-medium">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(activity.createdAt))}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
