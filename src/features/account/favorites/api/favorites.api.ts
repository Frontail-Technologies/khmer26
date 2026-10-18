import { apiClient } from '@/lib/api/client';
import type { PublicListing, ListingsPagination } from '@/features/listings/api/listings.api';

export interface FavoriteListing extends PublicListing {
  favoritedAt: string;
  isFavorited: true;
}

export interface FavoritesInput {
  page: number;
  limit?: number;
  q?: string;
  categoryId?: string;
  sort: 'recent' | 'newest' | 'price_asc' | 'price_desc';
}

export interface FavoritesPage {
  items: FavoriteListing[];
  pagination: ListingsPagination;
}

export async function getFavorites(input: FavoritesInput): Promise<FavoritesPage> {
  const limit = input.limit ?? 12;
  const response = await apiClient.get<{
    favorites: FavoriteListing[];
    pagination: ListingsPagination;
  }>('/favorites', {
    params: {
      page: input.page,
      limit,
      sort: input.sort,
      q: input.q || undefined,
      categoryId: input.categoryId || undefined,
    },
  });
  return { items: response.data.favorites, pagination: response.data.pagination };
}
