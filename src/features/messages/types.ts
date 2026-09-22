export type MessageStatus = "sending" | "sent" | "delivered" | "read"

export type MessageType = "text" | "image" | "offer" | "system"

export type OfferStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "countered"
  | "withdrawn"
  | "expired"

export type ConversationRole = "buyer" | "seller"

export type ListingAvailabilityStatus =
  | "active"
  | "reserved"
  | "sold"
  | "expired"
  | "removed"

export interface ConversationOffer {
  id: string
  amount: number
  askingPrice: number
  status: OfferStatus
  createdAt: string
  currency: string
  message?: string
  senderId: string
}

export interface ConversationMessage {
  id: string
  conversationId: string
  senderId: string
  type: MessageType
  content?: string
  imageUrl?: string
  imageAlt?: string
  offer?: ConversationOffer
  createdAt: string
  status: MessageStatus
}

export interface ConversationParticipant {
  id: string
  slug: string
  name: string
  avatar: string
  verified: boolean
  role: ConversationRole
  responseTime?: string
  responseRate?: string
  joinedAt?: string
  phone?: string
}

export interface ConversationListing {
  id: string
  slug: string
  title: string
  imageUrl: string
  price: number
  currency: string
  negotiable: boolean
  location: string
  status: ListingAvailabilityStatus
  categoryName?: string
}

export interface Conversation {
  id: string
  participant: ConversationParticipant
  listing: ConversationListing
  messages: ConversationMessage[]
  lastMessage: string
  updatedAt: string
  unreadCount: number
  archived: boolean
  blocked: boolean
  role: ConversationRole
}
