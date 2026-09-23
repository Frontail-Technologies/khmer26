export type NotificationChannel = "in_app" | "push" | "sms" | "telegram"

export type NotificationAudience = "all_users" | "sellers" | "dealers" | "buyers"

export type NotificationDeliveryStatus = "delivered" | "sending" | "scheduled" | "failed"

export interface NotificationCampaign {
  id: string
  title: string
  message: string
  targetUrl?: string
  audience: NotificationAudience
  channel: NotificationChannel
  sentAt: string
  status: NotificationDeliveryStatus
  recipientsCount: number
  deliveryRate: string
  sentBy: string
}

export interface NotificationTemplate {
  id: string
  key: string
  name: string
  category: "transactional" | "moderation" | "security" | "marketing"
  defaultChannel: NotificationChannel
  templateText: string
  variables: string[]
  isActive: boolean
}

export interface NotificationStats {
  broadcasts30d: number
  activeTemplates: number
  deliveryRate: string
  estimatedAudience: string
}
