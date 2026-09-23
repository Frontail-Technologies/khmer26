export type AdminReportStatus =
  | "open"
  | "in_review"
  | "resolved"
  | "dismissed"
  | "escalated"

export type AdminReportPriority = "normal" | "high" | "urgent"

export type AdminReportTargetType = "listing" | "user" | "seller" | "chat"

export type AdminReportReason =
  | "suspected_scam"
  | "misleading"
  | "duplicate"
  | "spam"
  | "wrong_category"
  | "inappropriate"
  | "prohibited_item"
  | "harassment"
  | "suspicious_account"
  | "other"

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

export interface AdminReportAuditEvent {
  id: string
  action: string
  actor: string
  actorRole: string
  timestamp: string
  details: string
}

export interface AdminReportInternalNote {
  id: string
  author: string
  authorAvatar?: string
  authorRole: string
  timestamp: string
  content: string
}

export interface AdminReportResolution {
  outcome: string
  reason: string
  resolvedBy: string
  resolvedAt: string
  notes?: string
}

export interface AdminReport {
  id: string
  targetType: AdminReportTargetType
  target: AdminReportTargetReference
  reason: AdminReportReason
  reasonLabel: string
  statement: string
  priority: AdminReportPriority
  status: AdminReportStatus
  reporter: AdminReportReporter
  assignedTo?: string
  createdAt: string
  createdDate: string
  timestamp: number
  sourceSurface?: string
  evidence: AdminReportEvidence[]
  internalNotes: AdminReportInternalNote[]
  history: AdminReportAuditEvent[]
  relatedReportIds?: string[]
  resolution?: AdminReportResolution
}

export interface AdminReportStats {
  open: number
  inReview: number
  urgent: number
  resolved30d: number
  avgResolutionHours: number
}
