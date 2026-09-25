export type NotificationAudience = "all_users" | "buyers" | "sellers" | "dealers" | "specific_user"

export type NotificationStatus = "sent" | "pending" | "failed"

export interface NotificationRecord {
  id: string
  title: string
  message: string
  audience: NotificationAudience
  targetUser?: string
  sentAt: string
  status: NotificationStatus
  sentBy: string
}
