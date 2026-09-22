import type { ListingCard } from "@/types"

export type SellerType = "Verified Dealer" | "Verified Business" | "Individual Seller"

export interface SellerProfileDetail {
  id: string
  slug: string
  name: string
  username: string
  avatar?: string
  coverImage?: string
  verified: boolean
  sellerType: SellerType
  joinedAt: string
  location: string
  responseTime?: string
  responseRate?: string
  rating: number
  reviewCount: number
  activeListings: number
  followers: number
  following: number
  bio?: string
  website?: string
  phone?: string
  languages?: string[]
  badges?: string[]
}

export interface SellerReview {
  id: string
  authorName: string
  authorAvatar?: string
  rating: number
  date: string
  comment: string
  verifiedPurchase?: boolean
  listingTitle?: string
}

export interface SellerDataBundle {
  seller: SellerProfileDetail
  listings: ListingCard[]
  reviews: SellerReview[]
}
