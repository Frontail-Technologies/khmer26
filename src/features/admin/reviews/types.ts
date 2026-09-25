export type AdminReviewStatus = "visible" | "hidden"

export interface AdminReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  status: AdminReviewStatus
  reportsCount: number
  reportReasons?: string[]
  reviewer: {
    id: string
    name: string
    avatarUrl?: string
    phone?: string
    email?: string
  }
  seller: {
    id: string
    name: string
    businessName?: string
    avatarUrl?: string
    rating: number
    totalReviewsCount: number
  }
  listing?: {
    id: string
    title: string
    price: number
    currency: string
    imageUrl?: string
  }
}
