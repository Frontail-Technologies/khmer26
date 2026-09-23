export type PromotionType = "featured" | "top_category" | "urgent" | "daily_bump"

export type PromotionStatus = "active" | "expired" | "scheduled" | "cancelled"

export interface PromotionProduct {
  id: string
  name: string
  type: PromotionType
  description: string
  durationDays: number
  priceDisplay: string
  placementDescription: string
  isActive: boolean
  activeCampaignsCount: number
}

export interface ActivePromotionItem {
  id: string
  listingId: string
  listingTitle: string
  listingPrice: number
  currency: string
  sellerId: string
  sellerName: string
  promotionType: PromotionType
  startedAt: string
  expiresAt: string
  status: PromotionStatus
  paymentReference?: string
  amountPaid?: number
}

export interface PromotionStats {
  activeBoosts: number
  featuredAds: number
  topCategoryAds: number
  urgentBadges: number
}
