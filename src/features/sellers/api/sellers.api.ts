import { apiClient } from '@/lib/api/client';
import type { PublicListing } from '@/features/listings/api/listings.api';
import type { ReportReason } from '@/features/listings/api/listing-detail.api';

export type SellerType = 'individual' | 'business' | 'dealer';

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

/** Exact response of GET /sellers/:id (data.profile). Contains no contact details or user ids. */
export interface SellerProfile {
  id: string;
  shopName: string;
  bio: string | null;
  sellerType: SellerType;
  avatarR2Key: string | null;
  joinedAt: string;
  isVerified: boolean;
  /** Public active listings, counted with the same rule as the listings endpoint. */
  listingCount: number;
  /** True when the signed-in viewer owns this profile. */
  isOwner: boolean;
  /** null until the seller has at least one visible review. */
  rating: { average: number; count: number; distribution: RatingDistribution } | null;
}

/** One visible review (GET /sellers/:id/reviews). The reviewer name is masked by the backend. */
export interface SellerReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string };
}

export interface Page<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface PageParams {
  page: number;
  limit: number;
}

function toPage<T>(res: {
  data: T[];
  meta?: Page<T>['pagination'];
  pagination?: Page<T>['pagination'];
}, params: PageParams): Page<T> {
  return {
    items: res.data,
    pagination: res.meta ??
      res.pagination ?? { ...params, total: res.data.length, totalPages: 1 },
  };
}

export async function getSeller(id: string): Promise<SellerProfile> {
  const res = await apiClient.get<{ profile: SellerProfile }>(`/sellers/${encodeURIComponent(id)}`);
  return res.data.profile;
}

export async function getSellerListingsPage(
  id: string,
  params: PageParams
): Promise<Page<PublicListing>> {
  const res = await apiClient.get<PublicListing[]>(`/sellers/${encodeURIComponent(id)}/listings`, {
    params: { ...params },
  });
  return toPage(res, params);
}

export async function getSellerReviewsPage(
  id: string,
  params: PageParams
): Promise<Page<SellerReview>> {
  const res = await apiClient.get<SellerReview[]>(`/sellers/${encodeURIComponent(id)}/reviews`, {
    params: { ...params },
  });
  return toPage(res, params);
}

export interface CreateReviewInput {
  sellerProfileId: string;
  rating: number;
  comment?: string;
}

export async function createReview(input: CreateReviewInput): Promise<void> {
  await apiClient.post('/reviews', input);
}

export async function getSellerReportReasons(): Promise<ReportReason[]> {
  const res = await apiClient.get<{ reasons: ReportReason[] }>('/reports/reasons', {
    params: { targetType: 'seller' },
  });
  return res.data.reasons;
}

export async function reportSeller(
  sellerId: string,
  input: { reasonId: string; details?: string }
): Promise<void> {
  await apiClient.post(`/reports/sellers/${encodeURIComponent(sellerId)}`, input);
}
