export type AdminListingStatus =
  | "pending"
  | "flagged"
  | "active"
  | "sold"
  | "expired"
  | "rejected"
  | "removed"
  | "draft"

export type AdminSellerType = "individual" | "business" | "dealer"

export interface AdminListingSeller {
  id: string
  name: string
  username?: string
  avatar?: string
  sellerType: AdminSellerType
  verified: boolean
  phone?: string
  email?: string
  joinedDate: string
  activeListings: number
  rating?: number
  slug?: string
}

export interface AdminListingImage {
  id: string
  url: string
  alt?: string
  isPrimary?: boolean
  flagged?: boolean
  flagReason?: string
}

export interface AdminListingReport {
  id: string
  reason: string
  reporterType: "buyer" | "seller" | "user" | "automated"
  reporterName?: string
  submittedAt: string
  status: "pending" | "reviewed" | "dismissed"
  notes?: string
}

export interface AdminListingAuditEvent {
  id: string
  action: string
  actor: string
  actorRole: string
  timestamp: string
  reason?: string
  details?: string
}

export interface AdminListingSpecification {
  label: string
  value: string
  group?: string
}

export interface AdminListing {
  id: string
  slug?: string
  title: string
  price: number
  currency: "USD" | "KHR"
  negotiable?: boolean
  categoryId: string
  categoryName: string
  categoryPath: string[]
  condition: string
  status: AdminListingStatus
  location: {
    province: string
    district?: string
    address?: string
  }
  seller: AdminListingSeller
  images: AdminListingImage[]
  description: string
  specifications: AdminListingSpecification[]
  reports: AdminListingReport[]
  history: AdminListingAuditEvent[]
  viewCount: number
  favoriteCount: number
  assignedTo?: string
  riskLevel?: "low" | "medium" | "high"
  createdAt: string
  createdDate: string
  updatedAt?: string
  rejectionReason?: string
  rejectionNote?: string
  removalReason?: string
}

export interface AdminListingStats {
  active: number
  pending: number
  flagged: number
  rejected: number
  submittedToday: number
  avgModerationMinutes: number
}
