import type {
  AdminDashboardMetric,
  ModerationQueueItem,
  AdminActivityItem,
  AdminListingOverview,
  AdminUserOverview,
  AdminUser,
} from "../types"

export const DEMO_ADMIN_USER: AdminUser = {
  id: "admin-1",
  name: "Dara Sok",
  email: "admin@khmer26.com",
  role: "super_admin",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
  lastActive: "Just now",
}

export const DEMO_DASHBOARD_METRICS: AdminDashboardMetric[] = [
  {
    id: "active-listings",
    label: "Active Listings",
    value: "14,820",
    change: "+12.4%",
    trend: "up",
    subtext: "vs last month",
  },
  {
    id: "pending-listings",
    label: "Pending Moderation",
    value: "42",
    change: "-8.1%",
    trend: "down",
    subtext: "14 urgent review",
  },
  {
    id: "registered-users",
    label: "Registered Users",
    value: "28,450",
    change: "+18.2%",
    trend: "up",
    subtext: "320 new this week",
  },
  {
    id: "verified-sellers",
    label: "Verified Sellers",
    value: "3,180",
    change: "+5.6%",
    trend: "up",
    subtext: "85% verification rate",
  },
  {
    id: "open-reports",
    label: "Open Reports",
    value: "8",
    change: "+2",
    trend: "down",
    subtext: "Requires review",
  },
  {
    id: "pending-verifications",
    label: "Pending Verifications",
    value: "5",
    change: "-3",
    trend: "up",
    subtext: "Gov ID approvals",
  },
  {
    id: "monthly-revenue",
    label: "Payments Volume",
    value: "$18,420",
    change: "+14.8%",
    trend: "up",
    subtext: "Boosts & Subscriptions",
  },
]

export const DEMO_MODERATION_QUEUE: ModerationQueueItem[] = [
  {
    id: "mod-1",
    type: "report",
    title: "Suspicious Vehicle Listing",
    subtitle: "Reported for counterfeit documents & price anomaly",
    status: "pending",
    submittedAt: "10m ago",
    priority: "urgent",
    targetId: "listing-101",
  },
  {
    id: "mod-2",
    type: "verification",
    title: "Phnom Penh Auto Co., Ltd.",
    subtitle: "Business license & National ID submitted",
    status: "pending",
    submittedAt: "25m ago",
    priority: "high",
    targetId: "seller-202",
  },
  {
    id: "mod-3",
    type: "listing",
    title: "iPhone 15 Pro Max 256GB Desert",
    subtitle: "New electronics seller first-time post",
    status: "pending",
    submittedAt: "45m ago",
    priority: "medium",
    targetId: "listing-103",
  },
  {
    id: "mod-4",
    type: "report",
    title: "Abusive Chat Message",
    subtitle: "User reported offensive behavior in negotiation",
    status: "investigating",
    submittedAt: "1h ago",
    priority: "medium",
    targetId: "chat-304",
  },
  {
    id: "mod-5",
    type: "verification",
    title: "Borey Villa Real Estate Agent",
    subtitle: "Real estate broker license verification",
    status: "pending",
    submittedAt: "2h ago",
    priority: "low",
    targetId: "seller-205",
  },
]

export const DEMO_RECENT_ACTIVITIES: AdminActivityItem[] = [
  {
    id: "act-1",
    adminName: "Dara Sok",
    action: "Approved business verification",
    target: "Sihanoukville Motors",
    timestamp: "12m ago",
    category: "moderation",
  },
  {
    id: "act-2",
    adminName: "Channary Meas",
    action: "Resolved spam report and warned seller",
    target: "Listing #4892",
    timestamp: "34m ago",
    category: "moderation",
  },
  {
    id: "act-3",
    adminName: "System",
    action: "Processed promotion payment ($25.00)",
    target: "Listing #1098",
    timestamp: "1h ago",
    category: "monetization",
  },
  {
    id: "act-4",
    adminName: "Dara Sok",
    action: "Updated homepage banner campaign",
    target: "Khmer New Year Sale 2026",
    timestamp: "2h ago",
    category: "content",
  },
  {
    id: "act-5",
    adminName: "Vannak Lim",
    action: "Suspended fraudulent user account",
    target: "user_89012@temp.com",
    timestamp: "3h ago",
    category: "users",
  },
]

export const DEMO_RECENT_LISTINGS: AdminListingOverview[] = [
  {
    id: "list-1",
    title: "2024 Lexus RX350 Luxury AWD",
    seller: "Kravan Auto Imports",
    category: "Vehicles",
    price: 89500,
    priceFormatted: "$89,500",
    status: "active",
    createdAt: "15m ago",
    views: 142,
    reportsCount: 0,
  },
  {
    id: "list-2",
    title: "Modern 2-Bedroom Condo BKK1",
    seller: "Sovann Real Estate",
    category: "Properties",
    price: 145000,
    priceFormatted: "$145,000",
    status: "active",
    createdAt: "40m ago",
    views: 310,
    reportsCount: 0,
  },
  {
    id: "list-3",
    title: "MacBook Pro M3 Max 36GB 1TB",
    seller: "Tech Zone Cambodia",
    category: "Electronics",
    price: 2650,
    priceFormatted: "$2,650",
    status: "pending",
    createdAt: "1h ago",
    views: 28,
    reportsCount: 0,
  },
  {
    id: "list-4",
    title: "Honda Scoopy 2024 Smart Key",
    seller: "Vireak Motor",
    category: "Motorcycles",
    price: 2280,
    priceFormatted: "$2,280",
    status: "active",
    createdAt: "2h ago",
    views: 520,
    reportsCount: 1,
  },
]

export const DEMO_RECENT_USERS: AdminUserOverview[] = [
  {
    id: "usr-1",
    name: "Sopheap Heng",
    email: "sopheap.h@gmail.com",
    phone: "+855 12 345 678",
    role: "Seller",
    verified: true,
    listingsCount: 18,
    joinedAt: "Today",
    status: "active",
  },
  {
    id: "usr-2",
    name: "Monyrath Chea",
    email: "monyrath.c@outlook.com",
    phone: "+855 87 654 321",
    role: "Buyer",
    verified: false,
    listingsCount: 0,
    joinedAt: "Yesterday",
    status: "active",
  },
  {
    id: "usr-3",
    name: "Angkor Prime Deals",
    email: "info@angkorprimedeals.kh",
    phone: "+855 23 888 999",
    role: "Store / Merchant",
    verified: true,
    listingsCount: 64,
    joinedAt: "3 days ago",
    status: "active",
  },
]

export const DEMO_CATEGORY_DISTRIBUTION = [
  { name: "Vehicles", count: 4820, percent: 32.5 },
  { name: "Properties", count: 3410, percent: 23.0 },
  { name: "Mobiles & Tech", count: 2890, percent: 19.5 },
  { name: "Electronics", count: 1720, percent: 11.6 },
  { name: "Fashion & Home", count: 1180, percent: 8.0 },
  { name: "Services & Others", count: 800, percent: 5.4 },
]

export interface AdminTopSeller {
  id: string
  name: string
  businessName?: string
  avatar: string
  category: string
  activeAds: number
  rating: number
  verified: boolean
  totalVolume: string
  plan: string
}

export const DEMO_TOP_SELLERS: AdminTopSeller[] = [
  {
    id: "seller-1",
    name: "Kravan Auto Imports",
    businessName: "Kravan Motors Co., Ltd.",
    avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&q=80",
    category: "Vehicles & Dealerships",
    activeAds: 48,
    rating: 4.9,
    verified: true,
    totalVolume: "$420,000",
    plan: "Enterprise Store",
  },
  {
    id: "seller-2",
    name: "Sovann Real Estate",
    businessName: "Sovann Capital Property",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
    category: "Real Estate & Villas",
    activeAds: 32,
    rating: 4.8,
    verified: true,
    totalVolume: "$1,850,000",
    plan: "Business Dealer",
  },
  {
    id: "seller-3",
    name: "Tech Zone Cambodia",
    businessName: "TechZone Mobile & Laptops",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
    category: "Electronics & Phones",
    activeAds: 64,
    rating: 4.9,
    verified: true,
    totalVolume: "$85,400",
    plan: "Pro Verified",
  },
  {
    id: "seller-4",
    name: "Angkor Prime Deals",
    businessName: "Angkor Prime Wholesale",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    category: "Home & Furniture",
    activeAds: 26,
    rating: 4.7,
    verified: true,
    totalVolume: "$34,200",
    plan: "Business Dealer",
  },
]

export const DEMO_SELLER_DISTRIBUTION = [
  { label: "Verified Dealerships", count: "1,420", percent: 38, color: "bg-primary" },
  { label: "Business Stores", count: "1,180", percent: 32, color: "bg-purple-500" },
  { label: "Individual Verified", count: "890", percent: 24, color: "bg-blue-500" },
  { label: "Pending Verification", count: "210", percent: 6, color: "bg-amber-500" },
]

export const DEMO_SUBSCRIPTION_DISTRIBUTION = [
  { label: "Enterprise Brand Store", count: 184, percent: 20, revenue: "$54.8k" },
  { label: "Business Dealership", count: 392, percent: 43, revenue: "$38.4k" },
  { label: "Pro Verified Seller", count: 341, percent: 37, revenue: "$16.8k" },
]
