export type AdminRole = "super_admin" | "admin" | "moderator" | "support"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  avatar?: string
  lastActive?: string
}

export type AdminPermission =
  | "listings.manage"
  | "users.manage"
  | "reports.manage"
  | "verifications.manage"
  | "payments.view"
  | "subscriptions.manage"
  | "content.manage"
  | "settings.manage"
  | "roles.manage"

export interface AdminDashboardMetric {
  id: string
  label: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  subtext?: string
}

export interface ModerationQueueItem {
  id: string
  type: "listing" | "report" | "verification" | "seller"
  title: string
  subtitle: string
  status: "pending" | "investigating" | "resolved" | "dismissed"
  submittedAt: string
  priority: "low" | "medium" | "high" | "urgent"
  targetId: string
}

export interface AdminActivityItem {
  id: string
  adminName: string
  action: string
  target: string
  timestamp: string
  category: "moderation" | "system" | "content" | "users" | "monetization"
}

export interface AdminListingOverview {
  id: string
  title: string
  seller: string
  category: string
  price: number
  priceFormatted: string
  status: "active" | "pending" | "paused" | "rejected" | "sold"
  createdAt: string
  views: number
  reportsCount: number
}

export interface AdminUserOverview {
  id: string
  name: string
  email: string
  phone: string
  role: string
  verified: boolean
  listingsCount: number
  joinedAt: string
  status: "active" | "suspended" | "pending"
}

export interface AdminVerificationOverview {
  id: string
  sellerName: string
  sellerPhone: string
  verificationType: "national_id" | "business_license" | "passport"
  submittedAt: string
  documentsCount: number
  status: "pending" | "approved" | "rejected"
  assignedTo?: string
}

export interface AdminReportOverview {
  id: string
  targetType: "listing" | "user" | "message"
  targetTitle: string
  reason: string
  reportedBy: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_review" | "resolved" | "dismissed"
  createdAt: string
}

export interface AdminPaymentOverview {
  id: string
  transactionId: string
  user: string
  type: string
  amount: number
  amountFormatted: string
  gateway: "Bakong KHQR" | "ABA PayWay" | "Credit Card"
  status: "success" | "pending" | "refunded" | "failed"
  date: string
}

export interface AdminSubscriptionOverview {
  id: string
  storeName: string
  plan: string
  billingCycle: "monthly" | "annual"
  nextRenewal: string
  status: "active" | "past_due" | "canceled"
}

export interface AdminAuditLogOverview {
  id: string
  timestamp: string
  adminName: string
  action: string
  target: string
  ipAddress: string
  status: "success" | "failed"
}
