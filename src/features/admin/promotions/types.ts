export type PromotionType = "featured" | "top_listing" | "urgent"

export type PromotionStatus = "active" | "expired"

export interface ActivePromotionItem {
  id: string
  listingId: string
  listingTitle: string
  listingPrice: number
  listingImage?: string
  currency: string
  sellerId: string
  sellerName: string
  promotionType: PromotionType
  durationDays: number
  startedAt: string
  expiresAt: string
  status: PromotionStatus
  paymentReference?: string
  amountPaid?: number
}
