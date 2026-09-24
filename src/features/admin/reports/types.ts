export type AdminReportStatus =
  | "open"
  | "in_review"
  | "resolved"
  | "dismissed"

export type AdminReportTargetType = "listing" | "user" | "seller" | "chat"

export interface AdminReportTargetParticipant {
  name: string
  avatar?: string
  role?: string
}

export interface AdminReportTargetReference {
  type: AdminReportTargetType
  id: string
  title: string
  subtitle?: string
  thumbnail?: string
  status?: string
  href: string
  price?: number
  currency?: string
  sellerName?: string
  sellerType?: string
  category?: string
  verified?: boolean
  joinedDate?: string
  participants?: AdminReportTargetParticipant[]
  snippet?: string
  reportCount?: number
}

export interface AdminReportReporter {
  name: string
  accountType: "user" | "buyer" | "seller" | "anonymous"
  email?: string
  phone?: string
  isProtected?: boolean
  joinedDate?: string
}

export interface AdminReportEvidence {
  id: string
  type: "image" | "screenshot" | "text_snippet" | "url"
  title: string
  url?: string
  content?: string
  uploadedAt?: string
}

export interface AdminReport {
  id: string
  targetType: AdminReportTargetType
  target: AdminReportTargetReference
  reason: string
  reasonLabel: string
  statement: string
  status: AdminReportStatus
  reporter: AdminReportReporter
  createdAt: string
  createdDate: string
  timestamp: number
  evidence?: AdminReportEvidence[]
  resolvedAt?: string
  resolvedBy?: string
  resolutionNote?: string
}

export interface AdminReportReasonItem {
  id: string
  label: string
  description?: string
  appliesTo: AdminReportTargetType[]
  isActive: boolean
  createdAt?: string
}
