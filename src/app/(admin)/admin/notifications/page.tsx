import type { Metadata } from "next"
import { NotificationWorkspace } from "@/features/admin/notifications/components/notification-workspace"
import { DEMO_NOTIFICATION_RECORDS } from "@/features/admin/notifications/data/demo-notification-data"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Send notifications to marketplace users.",
}

export default function AdminNotificationsPage() {
  return (
    <NotificationWorkspace
      records={DEMO_NOTIFICATION_RECORDS}
    />
  )
}
