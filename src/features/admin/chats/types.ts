export interface AdminChatParticipant {
  id: string
  name: string
  businessName?: string
  avatarUrl?: string
  phone: string
  email: string
  accountType: "buyer" | "seller" | "business" | "dealer"
}

export interface AdminChatListing {
  id: string
  title: string
  price: number
  currency: string
  imageUrl?: string
}

export interface AdminChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
  isReported?: boolean
  flagReason?: string
}

export interface AdminChatConversation {
  id: string
  participantA: AdminChatParticipant
  participantB: AdminChatParticipant
  listing?: AdminChatListing
  messages: AdminChatMessage[]
  lastMessage: string
  lastMessageAt: string
  isReported?: boolean
  reportId?: string
}
