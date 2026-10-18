import { apiClient } from "@/lib/api/client"

export type NotificationType =
  | "chat_message" | "offer_received" | "offer_accepted" | "offer_rejected"
  | "offer_countered" | "offer_withdrawn" | "listing_approved" | "listing_rejected"
  | "listing_expiring" | "listing_expired" | "subscription_expiring"
  | "subscription_expired" | "promotion_expiring" | "system"
  | "listing_favorited" | "saved_search_match" | "verification_updated" | "review_available"

export interface CustomerNotification {
  id: string
  type: NotificationType
  entityType: string | null
  entityId: string | null
  title: string
  titleKm?: string | null
  body: string
  bodyKm?: string | null
  readAt: string | null
  createdAt: string
}

export interface NotificationPage {
  items: CustomerNotification[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export async function getNotifications(page = 1, unreadOnly = false, limit = 20): Promise<NotificationPage> {
  const response = await apiClient.get<NotificationPage>("/notifications", {
    params: { page, limit, ...(unreadOnly ? { unreadOnly: true } : {}) },
  })
  return response.data
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await apiClient.get<{ unreadCount: number }>("/notifications/unread-count")
  return response.data.unreadCount
}

export const markNotificationRead = (id: string) =>
  apiClient.patch(`/notifications/${encodeURIComponent(id)}/read`)

export const markAllNotificationsRead = () => apiClient.post("/notifications/read-all")

export interface NotificationPreferences {
  newMessages: boolean
  listingFavorites: boolean
  listingStatusUpdates: boolean
  priceOffers: boolean
  promotions: boolean
  marketplaceAnnouncements: boolean
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await apiClient.get<{ preferences: NotificationPreferences }>("/notifications/preferences")
  return response.data.preferences
}

export async function updateNotificationPreferences(changes: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
  const response = await apiClient.patch<{ preferences: NotificationPreferences }>("/notifications/preferences", changes)
  return response.data.preferences
}

export function notificationHref(notification: Pick<CustomerNotification, "entityType" | "entityId">): string {
  const { entityType, entityId } = notification
  if (entityType === "conversation" && entityId) return `/messages/${entityId}`
  if (entityType === "offer") return "/messages"
  if (entityType === "listing" && entityId) return `/listing/${entityId}`
  if (entityType === "saved_search") return "/account/saved-searches"
  if (entityType === "subscription") return "/account/subscription"
  if (entityType === "verification_request") return "/account/profile"
  return "/account/notifications"
}
