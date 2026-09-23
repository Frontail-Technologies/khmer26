import type { Metadata } from "next"
import { SubscriptionWorkspace } from "@/features/admin/subscriptions/components/subscription-workspace"
import {
  DEMO_SUBSCRIPTION_STATS,
  DEMO_SUBSCRIPTION_PLANS,
  DEMO_SUBSCRIBERS,
} from "@/features/admin/subscriptions/data/demo-subscription-data"

export const metadata: Metadata = {
  title: "Subscriptions & Dealer Plans",
  description: "Manage dealer packages, seller plans, and membership tiers.",
}

export default function AdminSubscriptionsPage() {
  return (
    <SubscriptionWorkspace
      stats={DEMO_SUBSCRIPTION_STATS}
      plans={DEMO_SUBSCRIPTION_PLANS}
      subscribers={DEMO_SUBSCRIBERS}
    />
  )
}
