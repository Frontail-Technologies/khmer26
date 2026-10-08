import { apiClient } from '@/lib/api/client';

/** Canonical public listing summary returned by GET /listings and GET /home (newListings). */
export interface PublicListing {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; nameEn: string; nameKm: string | null; slug: string };
  location: {
    province: { id: number; nameEn: string; nameKm: string | null };
    district: { id: number; nameEn: string; nameKm: string | null } | null;
    commune: { id: number; nameEn: string; nameKm: string | null } | null;
  };
  seller: {
    id: string;
    userId: string;
    shopName: string | null;
    sellerType: 'individual' | 'business' | 'dealer';
    avatarMediaId: string | null;
  } | null;
  primaryImage: { mediaId: string; r2Key: string; mimeType: string; sizeBytes: number } | null;
  isFavorited?: boolean;
}

export interface ListingsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListingSearchPage {
  items: PublicListing[];
  pagination: ListingsPagination;
}

/** Exact backend query contract for GET /listings. */
export interface ListingSearchInput {
  q?: string;
  category?: string;
  provinceId?: number;
  districtId?: number;
  communeId?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  sort: string;
  fields?: Record<string, string>;
}

export const SEARCH_PAGE_SIZE = 12;

export function buildListingsQuery(
  input: ListingSearchInput,
  page: number,
  limit: number = SEARCH_PAGE_SIZE
): Record<string, string | number> {
  const query: Record<string, string | number> = { page, limit, sort: input.sort };
  if (input.q) query.q = input.q;
  if (input.category) query.categoryId = input.category;
  if (input.provinceId !== undefined) query.provinceId = input.provinceId;
  if (input.districtId !== undefined) query.districtId = input.districtId;
  if (input.communeId !== undefined) query.communeId = input.communeId;
  if (input.minPrice !== undefined) query.minPrice = input.minPrice;
  if (input.maxPrice !== undefined) query.maxPrice = input.maxPrice;
  if (input.currency) query.currency = input.currency;
  if (input.category && input.fields) {
    for (const [name, value] of Object.entries(input.fields)) {
      query[`fields[${name}]`] = value;
    }
  }
  return query;
}

export async function searchListings(
  input: ListingSearchInput,
  page: number,
  limit: number = SEARCH_PAGE_SIZE
): Promise<ListingSearchPage> {
  const res = await apiClient.get<PublicListing[]>('/listings', {
    params: buildListingsQuery(input, page, limit),
  });
  const pagination = res.meta ?? res.pagination ?? { page, limit, total: res.data.length, totalPages: 1 };
  return { items: res.data, pagination };
}
