export type ReportedChatStatus = "open" | "resolved" | "dismissed"

export interface ReportedChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
  isReported?: boolean
  flagReason?: string
}

export interface ReportedChatRecord {
  id: string
  conversationId: string
  reportedUserId: string
  reportedUserName: string
  reportedUserAccountType: string
  reporterId: string
  reporterName: string
  reason: string
  status: ReportedChatStatus
  createdAt: string
  participantA: {
    id: string
    name: string
  }
  participantB: {
    id: string
    name: string
  }
  listing?: {
    id: string
    title: string
    price: number
    currency: string
    imageUrl?: string
  }
  reportedMessageText: string
  messages: ReportedChatMessage[]
}
