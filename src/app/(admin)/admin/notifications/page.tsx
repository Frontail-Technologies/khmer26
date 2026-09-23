import type { Metadata } from "next"
import { NotificationWorkspace } from "@/features/admin/notifications/components/notification-workspace"
import {
  DEMO_NOTIFICATION_STATS,
  DEMO_NOTIFICATION_CAMPAIGNS,
  DEMO_NOTIFICATION_TEMPLATES,
} from "@/features/admin/notifications/data/demo-notification-data"

export const metadata: Metadata = {
  title: "Notifications & Broadcasts",
  description: "Broadcast system alerts, push notifications, and admin notices.",
}

export default function AdminNotificationsPage() {
  return (
    <NotificationWorkspace
      stats={DEMO_NOTIFICATION_STATS}
      campaigns={DEMO_NOTIFICATION_CAMPAIGNS}
      templates={DEMO_NOTIFICATION_TEMPLATES}
    />
  )
}
