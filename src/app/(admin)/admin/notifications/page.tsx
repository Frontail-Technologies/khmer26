import type { Metadata } from "next"
import { NotificationWorkspace } from "@/features/admin/notifications/components/notification-workspace"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Send notifications to marketplace users.",
}

export default function AdminNotificationsPage() {
  return <NotificationWorkspace />
}
