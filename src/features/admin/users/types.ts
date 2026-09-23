export type AdminAccountType = "buyer" | "seller" | "business" | "dealer"

export type AdminAccountStatus = "active" | "suspended" | "pending" | "restricted"

export type AdminVerificationState = "verified" | "unverified" | "pending"

export interface AdminUserListItem {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl?: string
  accountType: AdminAccountType
  businessName?: string
  location: string
  province: string
  listingsCount: number
  joinedAt: string
  verificationStatus: AdminVerificationState
  status: AdminAccountStatus
  reportsCount: number
  lastActiveAt: string
  rating?: number
  reviewsCount?: number
}

export interface AdminUserDetail extends AdminUserListItem {
  nationalIdMasked?: string
  registeredBusinessNumber?: string
  bio?: string
  address?: string
  activeListingsCount: number
  soldListingsCount: number
  totalSalesVolume?: string
  verifiedAt?: string
  assignedModerator?: string
  restrictionReason?: string
  accountHistory: Array<{
    id: string
    action: string
    actor: string
    timestamp: string
    note?: string
  }>
  recentListings: Array<{
    id: string
    title: string
    category: string
    price: number
    currency: string
    status: string
    createdAt: string
  }>
  recentReviews: Array<{
    id: string
    authorName: string
    rating: number
    comment: string
    createdAt: string
  }>
  relatedReports: Array<{
    id: string
    reason: string
    status: string
    createdAt: string
    reporterName: string
  }>
}

export interface AdminUserStats {
  totalAccounts: number
  totalAccountsGrowth: string
  activeSellers: number
  activeSellersGrowth: string
  businessDealers: number
  suspendedRestricted: number
}
