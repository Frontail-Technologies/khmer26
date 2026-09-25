import type { Metadata } from "next"
import { SubscriptionWorkspace } from "@/features/admin/subscriptions/components/subscription-workspace"
import {
  DEMO_SUBSCRIPTION_PLANS,
  DEMO_SUBSCRIBERS,
} from "@/features/admin/subscriptions/data/demo-subscription-data"

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage seller posting plans and subscribed merchants.",
}

export default function AdminSubscriptionsPage() {
  return (
    <SubscriptionWorkspace
      plans={DEMO_SUBSCRIPTION_PLANS}
      subscribers={DEMO_SUBSCRIBERS}
    />
  )
}
