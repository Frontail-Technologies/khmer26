import { apiClient } from '@/lib/api/client';
import type { SubscriberRecord, SubscriptionPlan, SubscriptionPlanTier } from '../types';

export interface BackendSubscriptionPlanDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number | null;
  currency?: string | null;
  billingInterval: string | null;
  durationDays: number | null;
  maxListings: number | null;
  featuredCredits?: number | null;
  bumpCredits?: number | null;
  sortOrder: number | null;
  isActive: boolean;
}

interface BackendSubscriberDto {
  id: string;
  userId: string;
  sellerName: string;
  businessName: string | null;
  planName: string;
  planSlug: string;
  maxListings: number | null;
  status: 'active' | 'expired';
  startedAt: string;
  expiresAt: string | null;
  paymentReference: string | null;
}

function tierFromSlug(slug: string): SubscriptionPlanTier {
  return slug.includes('business') ? 'business' : slug.includes('seller') ? 'seller_plus' : 'free';
}

export function normalizeSubscriptionPlan(p: BackendSubscriptionPlanDto): SubscriptionPlan {
  const tier = tierFromSlug(p.slug);

  return {
    id: p.id,
    name: p.name,
    tier,
    description: p.description || '',
    price: Number(p.price) || 0,
    currency: p.currency || 'USD',
    billingInterval: (p.billingInterval === 'annual' ? 'Annual' : 'Monthly') as 'Monthly' | 'Annual',
    maxListings: p.maxListings || 10,
    features: [
      `Up to ${p.maxListings || 10} active listings`,
      `${p.featuredCredits || 0} featured credits included`,
      `${p.bumpCredits || 0} bump credits included`,
    ],
    isActive: p.isActive,
    subscribersCount: 0,
  };
}

function normalizeSubscriber(s: BackendSubscriberDto): SubscriberRecord {
  return {
    id: s.id,
    sellerId: s.userId,
    sellerName: s.sellerName,
    businessName: s.businessName ?? undefined,
    planTier: tierFromSlug(s.planSlug),
    planName: s.planName,
    startedAt: new Date(s.startedAt).toLocaleDateString(),
    expiresAt: s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : 'No expiry',
    status: s.status,
    listingUsage: {
      used: 0,
      limit: s.maxListings ?? 0,
    },
    paymentReference: s.paymentReference ?? undefined,
  };
}

export async function getAdminSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await apiClient.get<{ plans: BackendSubscriptionPlanDto[] }>('/admin/subscription-plans');
  const raw = res.data?.plans || [];
  return raw.map(normalizeSubscriptionPlan);
}

export async function getAdminSubscribers(): Promise<SubscriberRecord[]> {
  const res = await apiClient.get<{ subscriptions: BackendSubscriberDto[] }>('/admin/subscriptions');
  return (res.data?.subscriptions || []).map(normalizeSubscriber);
}

export async function createAdminSubscriptionPlan(data: {
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency?: 'USD' | 'KHR';
  billingInterval?: string;
  durationDays?: number;
  maxListings?: number;
  featuredCredits?: number;
  bumpCredits?: number;
  sortOrder?: number;
  isActive?: boolean;
}) {
  return apiClient.post('/admin/subscription-plans', data);
}

export async function updateAdminSubscriptionPlan(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    currency: 'USD' | 'KHR';
    billingInterval: string;
    durationDays: number;
    maxListings: number;
    featuredCredits: number;
    bumpCredits: number;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  return apiClient.patch(`/admin/subscription-plans/${id}`, data);
}

export async function deactivateAdminSubscriptionPlan(id: string) {
  return apiClient.delete(`/admin/subscription-plans/${id}`);
}
