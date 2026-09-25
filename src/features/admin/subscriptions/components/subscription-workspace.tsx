"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShieldCheck } from "@phosphor-icons/react"
import { SubscriberTable } from "./subscriber-table"
import { SubscriptionPlansTable } from "./subscription-plans-table"
import type { SubscriptionPlan, SubscriberRecord } from "../types"

interface SubscriptionWorkspaceProps {
  plans: SubscriptionPlan[]
  subscribers: SubscriberRecord[]
}

export function SubscriptionWorkspace({
  plans,
  subscribers,
}: SubscriptionWorkspaceProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="subscribers" className="w-full">
        <TabsList className="grid grid-cols-2 h-9 bg-muted/60 p-1 mb-4 w-full sm:w-[320px]">
          <TabsTrigger value="subscribers" className="text-xs">
            <Users size={13} className="mr-1.5" />
            Subscribers ({subscribers.length})
          </TabsTrigger>
          <TabsTrigger value="plans" className="text-xs">
            <ShieldCheck size={13} className="mr-1.5" />
            Plans ({plans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers">
          <SubscriberTable initialSubscribers={subscribers} />
        </TabsContent>

        <TabsContent value="plans">
          <SubscriptionPlansTable initialPlans={plans} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
