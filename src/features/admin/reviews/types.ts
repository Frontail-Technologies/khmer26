export type AdminReviewStatus = "approved" | "flagged" | "removed" | "pending"

export type AdminSellerAccountType = "individual" | "business" | "dealer"

export interface AdminReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  status: AdminReviewStatus
  reportsCount: number
  isVerifiedPurchase: boolean
  reviewer: {
    id: string
    name: string
    avatarUrl?: string
    phone?: string
    email?: string
    joinedAt?: string
    totalReviewsGiven?: number
  }
  seller: {
    id: string
    name: string
    businessName?: string
    sellerType: AdminSellerAccountType
    avatarUrl?: string
    rating: number
    totalReviewsCount: number
  }
  listing?: {
    id: string
    title: string
    price: number
    currency: string
    category: string
  }
  moderationHistory: Array<{
    id: string
    action: string
    actor: string
    timestamp: string
    note?: string
  }>
  flagReason?: string
}

export interface AdminReviewStats {
  reviews30d: number
  reviews30dGrowth: string
  pendingFlagged: number
  averageRating: number
  removedCount: number
}
