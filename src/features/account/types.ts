import type { ListingCondition, ListingLocation } from "@/types/listing"

export type AccountListingStatus =
  | "active"
  | "pending"
  | "sold"
  | "draft"
  | "expired"
  | "paused"

export type AccountListingFilterStatus =
  | "all"
  | "active"
  | "pending"
  | "sold"
  | "draft"
  | "expired"

export interface AccountListingItem {
  id: string
  slug: string
  title: string
  price: number
  currency: string
  negotiable: boolean
  condition: ListingCondition
  status: AccountListingStatus
  imageUrl: string
  location: ListingLocation
  categoryName: string
  categoryId: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  viewsCount: number
  favoritesCount: number
  messagesCount: number
  featured?: boolean
}

export type PaymentType =
  | "subscription"
  | "promotion"
  | "featured_listing"
  | "top_listing"

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded"

export interface AccountPaymentRecord {
  id: string
  transactionId: string
  date: string
  description: string
  type: PaymentType
  amount: number
  currency: string
  paymentMethod: string
  status: PaymentStatus
  invoiceNumber: string
}

export interface AccountSubscriptionPlan {
  id: string
  name: string
  tier: "free" | "seller_plus" | "business"
  priceMonthly: number
  priceYearly: number
  currency: string
  isCurrent: boolean
  status: "active" | "inactive" | "trial"
  renewalDate?: string
  features: string[]
}

export interface AccountProfileData {
  fullName: string
  username: string
  email: string
  phone: string
  province: string
  district?: string
  bio: string
  businessName?: string
  sellerType: "individual" | "business"
  avatarUrl?: string
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  joinedAt: string
}

export interface AccountSettingsData {
  notifications: {
    newMessages: boolean
    listingFavorites: boolean
    listingStatusUpdates: boolean
    priceOffers: boolean
    promotions: boolean
    marketplaceAnnouncements: boolean
  }
  privacy: {
    showPhoneNumber: boolean
    allowBuyersFollow: boolean
    showActiveStatus: boolean
    showSellerRating: boolean
  }
  language: "en" | "km"
}
