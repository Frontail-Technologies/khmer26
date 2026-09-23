export type ChatReportStatus = "open" | "in_review" | "resolved" | "dismissed"

export type ChatReportPriority = "critical" | "high" | "medium" | "low"

export interface ReportedChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  isFlagged: boolean
  flagReason?: string
  attachmentUrl?: string
}

export interface ReportedChatCase {
  id: string
  reportId: string
  priority: ChatReportPriority
  status: ChatReportStatus
  reportedReason: string
  createdAt: string
  assignedModerator?: string
  reporterId: string
  buyer: {
    id: string
    name: string
    avatarUrl?: string
    phone: string
  }
  seller: {
    id: string
    name: string
    businessName?: string
    avatarUrl?: string
    phone: string
  }
  listing: {
    id: string
    title: string
    price: number
    currency: string
    imageUrl?: string
  }
  messages: ReportedChatMessage[]
  notes?: string
}

export interface ReportedChatStats {
  openCases: number
  inReviewCases: number
  autoFlaggedSpam: number
  resolved30d: number
}
