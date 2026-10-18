import { apiClient } from '@/lib/api/client';
import { getMediaUrl } from '@/lib/media/get-media-url';
import type { AccountListingItem, AccountListingStatus } from '../../types';

export type AccountListingFilter = 'all' | 'active' | 'pending' | 'rejected' | 'sold' | 'expired' | 'draft';

export interface AccountListingsQuery {
  status?: AccountListingFilter;
  page?: number;
  limit?: number;
}

export interface AccountListingsResult {
  items: AccountListingItem[];
  counts: Record<AccountListingFilter, number>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export type PromotionType = 'featured' | 'top_listing' | 'urgent';

export interface PromotionPackage {
  id: string;
  promotionType: PromotionType;
  name: string;
  nameKm?: string | null;
  description: string | null;
  descriptionKm?: string | null;
  durationDays: number;
  price: string;
  currency: 'USD' | 'KHR';
}

export interface AppliedPromotion {
  promotion: { id: string; listingId: string; startedAt: string; expiresAt: string };
  package: PromotionPackage;
  creditType: 'featured' | 'bump';
  remainingCredits: number;
}

function normalizeStatus(raw: Record<string, unknown>): AccountListingStatus {
  const status = String(raw.status ?? 'active');
  const moderationStatus = String(raw.moderationStatus ?? '');
  const expiresAt = raw.expiresAt ? new Date(String(raw.expiresAt)) : null;

  if (expiresAt && expiresAt.getTime() <= 1000) return 'draft';
  if (status === 'sold') return 'sold';
  if (status === 'deleted' || status === 'removed') return 'expired';
  if (status === 'expired' || (expiresAt && expiresAt.getTime() <= Date.now())) return 'expired';
  if (moderationStatus === 'rejected' || status === 'rejected') return 'rejected';
  if (moderationStatus === 'pending_review' || status === 'pending') return 'pending';
  return 'active';
}

export function normalizeAccountListing(raw: Record<string, unknown>): AccountListingItem {
  const category = (raw.category as Record<string, unknown> | undefined) ?? {};
  const province = (raw.province as Record<string, unknown> | undefined) ?? {};
  const district = (raw.district as Record<string, unknown> | undefined) ?? {};
  const primaryImage = (raw.primaryImage as Record<string, unknown> | undefined) ?? null;
  const createdAt = String(raw.createdAt ?? new Date().toISOString());
  const updatedAt = String(raw.updatedAt ?? createdAt);
  const status = normalizeStatus(raw);

  return {
    id: String(raw.id),
    slug: String(raw.slug ?? raw.id),
    title: String(raw.title ?? 'Untitled listing'),
    price: Number(raw.price ?? 0),
    currency: String(raw.currency ?? 'USD'),
    negotiable: Boolean(raw.negotiable),
    condition: (String(raw.condition ?? 'used') as AccountListingItem['condition']),
    status,
    imageUrl: getMediaUrl(primaryImage?.r2Key as string | null) ?? '',
    location: {
      province: String(province.nameEn ?? 'Phnom Penh'),
      district: district.nameEn ? String(district.nameEn) : undefined,
      label: [district.nameEn, province.nameEn].filter(Boolean).join(', ') || 'Cambodia',
    },
    categoryName: String(category.nameEn ?? 'Uncategorized'),
    categoryId: String(raw.categoryId ?? category.id ?? ''),
    createdAt,
    updatedAt,
    expiresAt: raw.expiresAt ? String(raw.expiresAt) : undefined,
    viewsCount: Number(raw.viewsCount ?? 0),
    favoritesCount: Number(raw.favoritesCount ?? 0),
    messagesCount: Number(raw.messagesCount ?? 0),
    featured: Boolean(raw.featured),
    urgent: Boolean(raw.urgent),
    topListing: Boolean(raw.topListing),
    moderationMatches: Array.isArray(raw.moderationMatches)
      ? raw.moderationMatches as AccountListingItem['moderationMatches']
      : [],
  };
}

const emptyCounts: Record<AccountListingFilter, number> = {
  all: 0,
  active: 0,
  pending: 0,
  rejected: 0,
  sold: 0,
  expired: 0,
  draft: 0,
};

export async function getAccountListings(params: AccountListingsQuery = {}): Promise<AccountListingsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const res = await apiClient.get<Record<string, unknown>[]>('/listings/me', {
    params: { page, limit, status: params.status ?? 'all' },
  });
  const meta = res.meta ?? res.pagination;
  const rawCounts = (meta as { counts?: Record<string, number> } | undefined)?.counts;
  const counts = { ...emptyCounts, ...(rawCounts ?? {}) };

  return {
    items: (res.data ?? []).map(normalizeAccountListing),
    counts: counts as Record<AccountListingFilter, number>,
    pagination: {
      page: meta?.page ?? page,
      limit: meta?.limit ?? limit,
      total: meta?.total ?? res.data?.length ?? 0,
      totalPages: meta?.totalPages ?? 1,
    },
  };
}

export function markAccountListingSold(id: string) {
  return apiClient.patch(`/listings/${id}/mark-sold`);
}

export function reactivateAccountListing(id: string) {
  return apiClient.patch(`/listings/${id}/reactivate`);
}

export function renewAccountListing(id: string) {
  return apiClient.post(`/listings/${id}/renew`);
}

export function deleteAccountListing(id: string) {
  return apiClient.delete(`/listings/${id}`);
}

export async function getPromotionPackages(): Promise<PromotionPackage[]> {
  const response = await apiClient.get<{ packages: PromotionPackage[] }>('/promotions/packages');
  return response.data.packages;
}

export async function applyListingPromotion(input: { listingId: string; packageId: string }) {
  const response = await apiClient.post<AppliedPromotion>(`/promotions/listings/${input.listingId}`, {
    packageId: input.packageId,
  });
  return response.data;
}
