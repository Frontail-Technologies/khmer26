export type NotificationAudience = "all_users" | "buyers" | "sellers" | "dealers" | "specific_user"

export type NotificationStatus = "sent" | "pending" | "failed"

export interface NotificationRecord {
  id: string
  displayId: string
  title: string
  titleKm: string | null
  message: string
  messageKm: string | null
  audience: NotificationAudience
  targetUser?: string
  sentAt: string
  status: NotificationStatus
  sentBy: string
}
