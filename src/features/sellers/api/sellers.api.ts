import { apiClient } from '@/lib/api/client';
import { toPage, type Page, type PageParams } from '@/lib/api/pagination';
import type { PublicListing } from '@/features/listings/api/listings.api';
import type { MaskedContact, ReportReason, RevealedContact } from '@/features/listings/api/listing-detail.api';

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
  /** Cover image (R2 key); the header falls back to the brand gradient when null. */
  coverR2Key: string | null;
  joinedAt: string;
  isVerified: boolean;
  /** Public active listings, counted with the same rule as the listings endpoint. */
  listingCount: number;
  /** Masked public contact numbers. Full numbers only come from revealSellerContacts. */
  contacts: MaskedContact[];
  /** Whether the signed-in viewer follows this seller (false when signed out). */
  isFollowing: boolean;
  /** Whether this seller accepts new followers. */
  allowBuyersFollow: boolean;
  /** True only when active-status sharing is enabled and a session was recently used. */
  isActive: boolean;
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
  isVerifiedTransaction: boolean;
  reviewer: { name: string };
}

export interface ReviewEligibility {
  eligible: boolean;
  reason: 'AUTH_REQUIRED' | 'OWN_PROFILE' | 'NO_COMPLETED_DEAL' | null;
  deal: {
    listingId: string;
    listingTitle: string;
    offerId: string;
  } | null;
}

export type { Page, PageParams };

export type SellerListingSort = 'newest' | 'price_asc' | 'price_desc';

export interface SellerListingFilters {
  q?: string;
  /** Category id; the backend includes its descendants. */
  categoryId?: string;
  sort?: SellerListingSort;
}

/** A category present in the seller's public inventory, with its real count. */
export interface SellerCategoryFacet {
  id: string;
  nameEn: string;
  nameKm: string | null;
  slug: string;
  count: number;
}

export interface SellerSearchResult {
  id: string;
  shopName: string;
  username: string | null;
  sellerType: SellerType;
  avatarR2Key: string | null;
  isVerified: boolean;
  listingCount: number;
}

export async function searchSellers(
  q: string,
  options: { group?: 'user' | 'company'; limit?: number } = {}
): Promise<SellerSearchResult[]> {
  const res = await apiClient.get<SellerSearchResult[]>('/sellers/search', { params: { q, ...options } });
  return res.data;
}

export async function getSeller(id: string): Promise<SellerProfile> {
  const res = await apiClient.get<{ profile: SellerProfile }>(`/sellers/${encodeURIComponent(id)}`);
  return res.data.profile;
}

export async function getSellerListingsPage(
  id: string,
  params: PageParams,
  filters: SellerListingFilters = {}
): Promise<Page<PublicListing>> {
  const res = await apiClient.get<PublicListing[]>(`/sellers/${encodeURIComponent(id)}/listings`, {
    params: {
      ...params,
      q: filters.q?.trim() || undefined,
      categoryId: filters.categoryId || undefined,
      sort: filters.sort && filters.sort !== 'newest' ? filters.sort : undefined,
    },
  });
  return toPage(res, params);
}

export async function getSellerCategories(id: string): Promise<SellerCategoryFacet[]> {
  const res = await apiClient.get<{ categories: SellerCategoryFacet[] }>(
    `/sellers/${encodeURIComponent(id)}/categories`
  );
  return res.data.categories;
}

/** Full public numbers of this seller (rate-limited and tracked by the backend). */
export async function revealSellerContacts(id: string): Promise<RevealedContact[]> {
  const res = await apiClient.post<{ contacts: RevealedContact[] }>(
    `/sellers/${encodeURIComponent(id)}/reveal-contact`
  );
  return res.data.contacts;
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
  listingId: string;
  offerId: string;
  rating: number;
  comment?: string;
}

export async function getReviewEligibility(sellerProfileId: string): Promise<ReviewEligibility> {
  const res = await apiClient.get<{ eligibility: ReviewEligibility }>('/reviews/eligibility', {
    params: { sellerProfileId },
  });
  return res.data.eligibility;
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
