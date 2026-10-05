import type { Metadata } from "next"
import { SubscriptionWorkspace } from "@/features/admin/subscriptions/components/subscription-workspace"

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage seller posting plans and subscribed merchants.",
}

export default function AdminSubscriptionsPage() {
  return (
    <SubscriptionWorkspace />
  )
}
