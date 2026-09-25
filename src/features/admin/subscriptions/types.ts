export type SubscriptionPlanTier = "free" | "seller_plus" | "business"

export type SubscriptionStatus = "active" | "expired" | "paused"

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionPlanTier
  description: string
  price: number
  currency: string
  billingInterval: "Monthly" | "Annual"
  maxListings: number
  features: string[]
  isActive: boolean
  subscribersCount: number
}

export interface SubscriberRecord {
  id: string
  sellerId: string
  sellerName: string
  businessName?: string
  planTier: SubscriptionPlanTier
  planName: string
  startedAt: string
  expiresAt: string
  status: SubscriptionStatus
  listingUsage: {
    used: number
    limit: number
  }
  paymentReference?: string
}
