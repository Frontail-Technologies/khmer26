import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSavedSearch,
  deleteSavedSearch,
  getSavedSearches,
  updateSavedSearch,
} from './saved-searches.api';
import { getFavorites } from '../../favorites/api/favorites.api';

function mockFetch(data: unknown, meta?: Record<string, number>) {
  const fetchMock = vi.fn().mockImplementation(async (url: string | URL) => {
    if (String(url).includes('/auth/csrf')) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { csrfToken: 'test-csrf' } }),
      };
    }
    return {
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data, meta }),
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('Phase 2 customer API contracts', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('loads server-filtered favorites and unwraps their pagination', async () => {
    const favorite = { id: 'listing-1', title: 'Prius', isFavorited: true };
    const fetchMock = mockFetch({
      favorites: [favorite],
      pagination: { page: 2, limit: 12, total: 15, totalPages: 2 },
    });

    const result = await getFavorites({ page: 2, q: 'Prius', sort: 'price_asc' });

    expect(result.items).toEqual([favorite]);
    expect(result.pagination.total).toBe(15);
    expect(String(fetchMock.mock.calls[0][0])).toContain('/favorites?');
    expect(String(fetchMock.mock.calls[0][0])).toContain('sort=price_asc');
  });

  it('uses authenticated CRUD routes for saved searches', async () => {
    const savedSearch = {
      id: 'search-1',
      name: 'Cars',
      filters: { sort: 'newest', fields: {} },
      notificationsEnabled: true,
    };
    const fetchMock = mockFetch({ savedSearch });

    await createSavedSearch({
      name: 'Cars',
      filters: { sort: 'newest', fields: {} },
      notificationsEnabled: true,
    });
    await updateSavedSearch('search-1', { notificationsEnabled: false });
    await deleteSavedSearch('search-1');

    const calls = fetchMock.mock.calls.filter(([url]) => !String(url).includes('/auth/csrf'));
    expect(calls.map(([, config]) => config?.method)).toEqual(['POST', 'PATCH', 'DELETE']);
    expect(String(calls[1]![0])).toContain('/saved-searches/search-1');
  });

  it('reads saved-search pagination from response metadata', async () => {
    mockFetch([], { page: 1, limit: 20, total: 0, totalPages: 0 });
    const result = await getSavedSearches();
    expect(result.items).toEqual([]);
    expect(result.pagination.totalPages).toBe(0);
  });
});
