import { apiClient } from "@/lib/api/client"

export interface SubscriptionPlan {
  id: string
  name: string
  nameKm?: string | null
  slug: string
  description: string | null
  descriptionKm?: string | null
  price: string | null
  currency: string
  billingInterval: string | null
  durationDays: number | null
  maxListings: number | null
  featuredCredits: number
  bumpCredits: number
  isActive: boolean
}

export interface SubscriptionUsage {
  plan: SubscriptionPlan
  activeListings: number
  activeListingLimit: number | null
  remainingListings: number | null
  featuredCredits: number
  bumpCredits: number
  featuredCreditsUsed: number
  bumpCreditsUsed: number
  remainingFeaturedCredits: number
  remainingBumpCredits: number
  expiresAt: string | null
}

export interface SubscriptionHistoryItem {
  id: string
  status: "active" | "expired"
  startedAt: string
  expiresAt: string | null
  createdAt: string
  plan: Pick<SubscriptionPlan, "id" | "name" | "nameKm" | "slug" | "price" | "currency" | "billingInterval">
  paymentReference: string | null
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiClient.get<{ plans: SubscriptionPlan[] }>("/subscription-plans")
  return response.data.plans
}

export async function getSubscriptionUsage(): Promise<SubscriptionUsage> {
  const response = await apiClient.get<SubscriptionUsage>("/users/me/subscription-usage")
  return response.data
}

export async function getSubscriptionHistory(): Promise<SubscriptionHistoryItem[]> {
  const response = await apiClient.get<{ subscriptions: SubscriptionHistoryItem[] }>("/users/me/subscriptions")
  return response.data.subscriptions
}
