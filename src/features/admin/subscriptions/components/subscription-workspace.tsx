"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriberTable } from "./subscriber-table"
import { SubscriptionPlansTable } from "./subscription-plans-table"
import { useAdminSubscribers, useAdminSubscriptionPlans } from "../hooks/subscriptions.queries"
import type { SubscriptionPlan, SubscriberRecord } from "../types"
import { cn } from "@/lib/utils"

interface SubscriptionWorkspaceProps {
  plans?: SubscriptionPlan[]
  subscribers?: SubscriberRecord[]
}

type SubscriptionTabKey = "subscribers" | "plans"

export function SubscriptionWorkspace({
  plans: fallbackPlans = [],
  subscribers: fallbackSubscribers = [],
}: SubscriptionWorkspaceProps) {
  const { data: remotePlans } = useAdminSubscriptionPlans()
  const { data: remoteSubscribers } = useAdminSubscribers()
  const plans = remotePlans ?? fallbackPlans
  const subscribers = remoteSubscribers ?? fallbackSubscribers
  const [activeTab, setActiveTab] = useState<SubscriptionTabKey>("subscribers")

  const tabs: { key: SubscriptionTabKey; label: string; count: number }[] = [
    { key: "subscribers", label: "Subscribers", count: subscribers.length },
    { key: "plans", label: "Plans", count: plans.length },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <Tabs
          value={activeTab}
          onValueChange={(val) => val && setActiveTab(val as SubscriptionTabKey)}
          className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar"
        >
          <TabsList variant="line">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                  <span>{tab.label}</span>
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
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        {activeTab === "subscribers" ? (
          <SubscriberTable initialSubscribers={subscribers} />
        ) : (
          <SubscriptionPlansTable initialPlans={plans} />
        )}
      </div>
    </div>
  )
}
