import { describe, expect, it, vi, beforeEach } from 'vitest';
import { updateAdminReviewStatus } from './reviews.api';

function mockFetchOnce(body: unknown = { success: true, data: {} }) {
  const fetchMock = vi.fn().mockImplementation(async (url: string | URL) => {
    const urlStr = String(url);
    if (urlStr.includes('/auth/csrf')) {
      return {
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { csrfToken: 'test-csrf' } }),
      };
    }
    return {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => body,
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('review moderation status contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('updates review visibility via PATCH /admin/reviews/:id/status, not /admin/reviews/reports/:id/status', async () => {
    const fetchMock = mockFetchOnce();
    await updateAdminReviewStatus('review-1', 'hidden');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [url, config] = targetCall;
    expect(String(url)).toContain('/admin/reviews/review-1/status');
    expect(String(url)).not.toContain('/reviews/reports');
    expect(config?.method).toBe('PATCH');
    expect(JSON.parse(String(config?.body))).toEqual({ visibility: 'hidden' });
  });
});
