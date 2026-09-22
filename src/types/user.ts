
export type UserRole = "buyer" | "seller" | "business" | "admin"

export type SubscriptionTier = "free" | "basic" | "pro" | "business"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  subscription: SubscriptionTier
  joinedAt: string
  isVerified: boolean
}

export interface SellerProfile {
  userId: string
  username: string
  displayName: string
  avatarUrl?: string
  coverUrl?: string
  bio?: string
  location?: string
  phone?: string
  whatsapp?: string
  memberSince: string
  isVerified: boolean
  isBusiness: boolean
  businessName?: string
  totalListings: number
  activeListings: number
  responseRate?: number
  rating?: number
  reviewCount?: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  maxActiveListings: number | null
  price: number
  currency: string
  billingPeriod: "monthly" | "yearly"
  features: string[]
  isPopular?: boolean
}
