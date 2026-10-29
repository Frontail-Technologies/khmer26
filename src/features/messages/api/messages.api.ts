import { apiClient } from "@/lib/api/client"
import { getMediaUrl } from "@/lib/media/get-media-url"
import type { Conversation, ConversationMessage } from "../types"
import { normalizeOfferStatus } from "../lib/offer-cache"

interface RawConversation {
  id: string
  listing: {
    id: string
    title: string
    price: string | number | null
    currency: "USD" | "KHR" | null
    status: "active" | "sold" | "expired"
    negotiable: boolean
    location: string
    imageR2Key: string | null
  }
  otherParticipant: {
    userId: string
    shopName: string
    sellerType: string
    sellerProfileId: string | null
    avatarR2Key: string | null
    isVerified: boolean
  } | null
  lastMessage: { text: string; textKm?: string | null; createdAt: string } | null
  lastMessageAt: string
  isArchived: boolean
  isBlocked: boolean
  role: "buyer" | "seller"
  unreadCount: number
}

interface RawMessage {
  id: string
  conversationId: string
  senderUserId: string
  isOutgoing: boolean
  type: "text" | "image" | "offer" | "system"
  text: string
  textKm?: string | null
  media: { r2Key: string; originalFilename: string | null } | null
  offer: {
    id: string
    amount: number
    currency: string
    status: string
    counterAmount: number | null
    note: string | null
  } | null
  createdAt: string
}

export interface ChatPage<T> {
  items: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

const PLACEHOLDER_IMAGE = "/images/categories/services.jpg"

function toConversation(raw: RawConversation): Conversation {
  const participant = raw.otherParticipant
  return {
    id: raw.id,
    role: raw.role,
    participant: {
      id: participant?.userId ?? "",
      slug: participant?.sellerProfileId ?? participant?.userId ?? "",
      name: participant?.shopName ?? "offerupkh User",
      avatar: getMediaUrl(participant?.avatarR2Key) ?? "",
      verified: participant?.isVerified ?? false,
      role: raw.role === "buyer" ? "seller" : "buyer",
    },
    listing: {
      id: raw.listing.id,
      slug: raw.listing.id,
      title: raw.listing.title,
      imageUrl: getMediaUrl(raw.listing.imageR2Key) ?? PLACEHOLDER_IMAGE,
      price: Number(raw.listing.price ?? 0),
      currency: raw.listing.currency ?? "USD",
      negotiable: raw.listing.negotiable,
      location: raw.listing.location,
      status: raw.listing.status,
    },
    messages: [],
    lastMessage: raw.lastMessage?.text || "",
    lastMessageKm: raw.lastMessage?.textKm ?? undefined,
    updatedAt: raw.lastMessage?.createdAt || raw.lastMessageAt,
    unreadCount: raw.unreadCount,
    archived: raw.isArchived,
    blocked: raw.isBlocked,
  }
}

export async function getConversations(archived?: boolean): Promise<ChatPage<Conversation>> {
  const response = await apiClient.get<{ items: RawConversation[]; pagination: ChatPage<never>["pagination"] }>(
    "/chat/conversations",
    { params: { page: 1, limit: 50, archived } }
  )
  return { ...response.data, items: response.data.items.map(toConversation) }
}

export async function getMessages(conversationId: string, askingPrice: number): Promise<ConversationMessage[]> {
  const response = await apiClient.get<{ items: RawMessage[] }>(
    `/chat/conversations/${encodeURIComponent(conversationId)}/messages`,
    { params: { limit: 100, direction: "before" } }
  )
  return response.data.items.map((raw) => ({
    id: raw.id,
    conversationId: raw.conversationId,
    senderId: raw.senderUserId,
    type: raw.type,
    content: raw.text || undefined,
    contentKm: raw.textKm ?? undefined,
    imageUrl: getMediaUrl(raw.media?.r2Key) ?? undefined,
    imageAlt: raw.media?.originalFilename ?? undefined,
    offer: raw.offer ? {
      id: raw.offer.id,
      amount: raw.offer.counterAmount ?? raw.offer.amount,
      askingPrice,
      status: normalizeOfferStatus(raw.offer.status),
      createdAt: raw.createdAt,
      currency: raw.offer.currency,
      message: raw.offer.note ?? undefined,
      senderId: raw.senderUserId,
    } : undefined,
    createdAt: raw.createdAt,
    status: "sent",
  }))
}

export const sendTextMessage = (conversationId: string, text: string) =>
  apiClient.post(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, { type: "text", text })

export const sendImageMessage = (conversationId: string, mediaId: string, text?: string) =>
  apiClient.post(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, { type: "image", mediaId, ...(text ? { text } : {}) })

export const markConversationRead = (conversationId: string) =>
  apiClient.post(`/chat/conversations/${encodeURIComponent(conversationId)}/read`)

export const archiveConversation = (conversationId: string) =>
  apiClient.post(`/chat/conversations/${encodeURIComponent(conversationId)}/archive`)

export const unarchiveConversation = (conversationId: string) =>
  apiClient.delete(`/chat/conversations/${encodeURIComponent(conversationId)}/archive`)

export const blockUser = (userId: string) => apiClient.post(`/users/${encodeURIComponent(userId)}/block`)
export const unblockUser = (userId: string) => apiClient.delete(`/users/${encodeURIComponent(userId)}/block`)

export const createOffer = (conversationId: string, amount: number, currency: string, note?: string) =>
  apiClient.post(`/chat/conversations/${encodeURIComponent(conversationId)}/offers`, { amount, currency, ...(note ? { note } : {}) })

export type OfferAction = "accept" | "reject" | "withdraw"
export interface OfferActionResult {
  offerId: string
  status: string
  conversationId: string
  counterAmount?: number | null
}
export const updateOffer = (offerId: string, action: OfferAction) =>
  apiClient.post<OfferActionResult>(`/offers/${encodeURIComponent(offerId)}/${action}`)

export const counterOffer = (offerId: string, amount: number) =>
  apiClient.post(`/offers/${encodeURIComponent(offerId)}/counter`, { amount })

export interface ReportReason { id: string; label: string; labelKm?: string | null; description?: string | null; descriptionKm?: string | null }
export async function getChatReportReasons(): Promise<ReportReason[]> {
  const response = await apiClient.get<{ reasons: ReportReason[] }>("/reports/reasons", { params: { targetType: "chat" } })
  return response.data.reasons
}

export const reportConversation = (conversationId: string, reasonId: string, details?: string) =>
  apiClient.post(`/reports/chat/${encodeURIComponent(conversationId)}`, { reasonId, ...(details ? { details } : {}) })

export async function getWebSocketTicket(): Promise<string> {
  const response = await apiClient.post<{ ticket: string }>("/chat/ws-ticket")
  return response.data.ticket
}
