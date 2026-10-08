import { apiClient } from '@/lib/api/client';
import type { PublicListing } from './listings.api';

export interface CategoryCrumb {
  id: string;
  nameEn: string;
  nameKm: string | null;
  slug: string;
}

export interface LocationLevel {
  id: number;
  nameEn: string;
  nameKm: string | null;
}

export interface ListingSpec {
  fieldId: string;
  name: string;
  labelEn: string;
  labelKm: string | null;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  displayOrder: number;
  value: string | number | boolean;
  valueLabelEn?: string;
  valueLabelKm?: string | null;
}

/** Exact response of GET /listings/:id (data.listing). */
export interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: 'USD' | 'KHR' | null;
  status: string;
  /** Only present for the owner. */
  moderationStatus?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  category: CategoryCrumb & { breadcrumb: CategoryCrumb[] };
  location: {
    province: LocationLevel;
    district: LocationLevel | null;
    commune: LocationLevel | null;
    /** Approximate administrative-area centre resolved by the backend, or null without coordinates. */
    map: { latitude: number; longitude: number; precision: 'commune' | 'district' | 'province' } | null;
  };
  media: Array<{ id: string; r2Key: string; mimeType: string; displayOrder: number }>;
  specs: ListingSpec[];
  seller: {
    id: string;
    shopName: string | null;
    sellerType: 'individual' | 'business' | 'dealer';
    avatarR2Key: string | null;
    joinedAt: string;
    isVerified: boolean;
    /** null until the seller has at least one visible review. */
    rating: { average: number; count: number } | null;
  } | null;
  isFavorited: boolean;
  isOwner: boolean;
  views: number;
}

export interface ReportReason {
  id: string;
  label: string;
  description: string | null;
}

export async function getListing(id: string): Promise<ListingDetail> {
  const res = await apiClient.get<{ listing: ListingDetail }>(`/listings/${encodeURIComponent(id)}`);
  return res.data.listing;
}

export async function getSimilarListings(id: string, limit = 12): Promise<PublicListing[]> {
  const res = await apiClient.get<{ listings: PublicListing[] }>(
    `/listings/${encodeURIComponent(id)}/similar`,
    { params: { limit } }
  );
  return res.data.listings;
}

export async function addFavorite(listingId: string): Promise<void> {
  await apiClient.post(`/listings/${encodeURIComponent(listingId)}/favorite`);
}

export async function removeFavorite(listingId: string): Promise<void> {
  await apiClient.delete(`/listings/${encodeURIComponent(listingId)}/favorite`);
}

export async function getReportReasons(targetType: 'listing'): Promise<ReportReason[]> {
  const res = await apiClient.get<{ reasons: ReportReason[] }>('/reports/reasons', {
    params: { targetType },
  });
  return res.data.reasons;
}

export async function reportListing(
  listingId: string,
  input: { reasonId: string; details?: string }
): Promise<void> {
  await apiClient.post(`/reports/listings/${encodeURIComponent(listingId)}`, input);
}

export async function startConversation(listingId: string): Promise<{ id: string }> {
  const res = await apiClient.post<{ conversation: { id: string } }>('/chat/conversations', {
    listingId,
  });
  return res.data.conversation;
}

export async function createOffer(
  conversationId: string,
  input: { amount: number; currency: 'USD' | 'KHR' }
): Promise<void> {
  await apiClient.post(`/chat/conversations/${encodeURIComponent(conversationId)}/offers`, input);
}

/** Public listings of a seller (GET /sellers/:id/listings). `sellerId` is the seller profile id. */
export async function getSellerListings(sellerId: string, limit = 13): Promise<PublicListing[]> {
  const res = await apiClient.get<PublicListing[]>(
    `/sellers/${encodeURIComponent(sellerId)}/listings`,
    { params: { limit } }
  );
  return res.data;
}
