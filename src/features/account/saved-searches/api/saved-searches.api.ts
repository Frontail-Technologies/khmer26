import { apiClient } from '@/lib/api/client';
import type { SearchFilters } from '@/features/search/lib/search-filters';

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearchesPage {
  items: SavedSearch[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function getSavedSearches(page = 1, limit = 20): Promise<SavedSearchesPage> {
  const response = await apiClient.get<SavedSearch[]>('/saved-searches', { params: { page, limit } });
  const meta = response.meta ?? response.pagination;
  return {
    items: response.data,
    pagination: {
      page: meta?.page ?? page,
      limit: meta?.limit ?? limit,
      total: meta?.total ?? response.data.length,
      totalPages: meta?.totalPages ?? 1,
    },
  };
}

export async function createSavedSearch(input: {
  name: string;
  filters: SearchFilters;
  notificationsEnabled: boolean;
}): Promise<SavedSearch> {
  const response = await apiClient.post<{ savedSearch: SavedSearch }>('/saved-searches', input);
  return response.data.savedSearch;
}

export async function updateSavedSearch(
  id: string,
  input: { name?: string; filters?: SearchFilters; notificationsEnabled?: boolean }
): Promise<SavedSearch> {
  const response = await apiClient.patch<{ savedSearch: SavedSearch }>(
    `/saved-searches/${encodeURIComponent(id)}`,
    input
  );
  return response.data.savedSearch;
}

export async function deleteSavedSearch(id: string): Promise<void> {
  await apiClient.delete(`/saved-searches/${encodeURIComponent(id)}`);
}
