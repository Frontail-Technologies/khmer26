"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { NotificationComposer } from "./notification-composer"
import { NotificationHistoryTable } from "./notification-history-table"
import type { NotificationRecord } from "../types"
import { cn } from "@/lib/utils"

interface NotificationWorkspaceProps {
  records: NotificationRecord[]
}

type NotificationTabKey = "compose" | "history"

export function NotificationWorkspace({
  records,
}: NotificationWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<NotificationTabKey>("compose")

  const tabs: { key: NotificationTabKey; label: string; count?: number }[] = [
    { key: "compose", label: "Send Notification" },
    { key: "history", label: "History", count: records.length },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 border-transparent",
                    isActive
                      ? "bg-card text-foreground border-primary shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-1.5 py-0 h-4 text-[10px] font-bold rounded-md border",
                        isActive
                          ? "bg-muted text-foreground border-border"
                          : "bg-background/80 text-muted-foreground border-border/60"
                      )}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === "compose" ? (
          <NotificationComposer />
        ) : (
          <NotificationHistoryTable initialRecords={records} />
        )}
      </div>
    </div>
  )
}
