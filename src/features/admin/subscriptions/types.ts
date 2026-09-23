export type SubscriptionPlanTier = "free" | "pro" | "business" | "enterprise"

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing"

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionPlanTier
  description: string
  priceDisplay: string
  billingInterval: "Monthly" | "Annual" | "Custom"
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
  renewsAt: string
  status: SubscriptionStatus
  listingUsage: {
    used: number
    limit: number
  }
  paymentReference?: string
}

export interface SubscriptionStats {
  activeProSellers: number
  activeProGrowth: string
  enterpriseStores: number
  monthlyChurnRate: string
  mrrDisplay: string
}
