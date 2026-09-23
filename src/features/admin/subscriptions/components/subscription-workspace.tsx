"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShieldCheck } from "@phosphor-icons/react"
import { SubscriptionSummaryMetrics } from "./subscription-summary-metrics"
import { SubscriptionPlansGrid } from "./subscription-plans-grid"
import { SubscriberTable } from "./subscriber-table"
import type { SubscriptionPlan, SubscriberRecord, SubscriptionStats } from "../types"

interface SubscriptionWorkspaceProps {
  stats: SubscriptionStats
  plans: SubscriptionPlan[]
  subscribers: SubscriberRecord[]
}

export function SubscriptionWorkspace({
  stats,
  plans,
  subscribers,
}: SubscriptionWorkspaceProps) {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <SubscriptionSummaryMetrics stats={stats} />

      <Tabs defaultValue="subscribers" className="w-full">
        <TabsList className="grid grid-cols-2 h-9 bg-muted/60 p-1 mb-4 w-full sm:w-[360px]">
          <TabsTrigger value="subscribers" className="text-xs">
            <Users size={13} className="mr-1.5" />
            Subscribers ({subscribers.length})
          </TabsTrigger>
          <TabsTrigger value="plans" className="text-xs">
            <ShieldCheck size={13} className="mr-1.5" />
            Plans & Packages ({plans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers">
          <SubscriberTable initialSubscribers={subscribers} />
        </TabsContent>

        <TabsContent value="plans">
          <SubscriptionPlansGrid plans={plans} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
