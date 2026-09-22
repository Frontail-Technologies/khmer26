export type ListingStatus =
  | "active"
  | "pending"
  | "draft"
  | "sold"
  | "expired"
  | "paused"
  | "deleted"

export type ListingCondition =
  | "new"
  | "like_new"
  | "good"
  | "fair"
  | "for_parts"

export interface ListingLocation {
  province: string
  district?: string
  label: string
}

export interface ListingImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface Listing {
  id: string
  slug: string
  title: string
  description: string
  price: number
  currency: string
  negotiable: boolean
  condition: ListingCondition
  status: ListingStatus
  images: ListingImage[]
  location: ListingLocation
  categoryId: string
  categoryPath: string[]
  sellerId: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  viewCount?: number
  isFavorited?: boolean
  featured?: boolean
  verified?: boolean
  metadata?: string[]
  attributes?: Array<{
    label: string
    value: string
  }>
  brand?: string
  year?: number
  mileage?: number
  fuel?: string
  transmission?: string
  sellerType?: "individual" | "dealer"
}

export interface ListingCard {
  id: string
  slug: string
  title: string
  price: number
  currency: string
  negotiable: boolean
  condition: ListingCondition
  status: ListingStatus
  primaryImage?: ListingImage
  location: ListingLocation
  categoryPath: string[]
  createdAt: string
  isFavorited?: boolean
  featured?: boolean
  verified?: boolean
  metadata?: string[]
  attributes?: Array<{
    label: string
    value: string
  }>
  brand?: string
  year?: number
  mileage?: number
  fuel?: string
  transmission?: string
  sellerType?: "individual" | "dealer"
}

export interface ListingSeller {
  id: string
  slug: string
  name: string
  username?: string
  avatar?: string
  verified: boolean
  joinedAt: string
  responseTime: string
  responseRate?: string
  activeListings: number
  phone?: string
  rating?: number
}

export interface ListingDetail extends Listing {
  seller: ListingSeller
  viewCount: number
  negotiable: boolean
  safetyTips?: string[]
}


