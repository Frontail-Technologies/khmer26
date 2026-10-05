import { describe, expect, it, vi, beforeEach } from 'vitest';
import { activateAdminPromotionPackage, deactivateAdminPromotionPackage } from './promotions.api';

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

describe('promotion package activate/deactivate contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('activates a package via POST /admin/promotions/packages/:id/activate, not PATCH .../status', async () => {
    const fetchMock = mockFetchOnce();
    await activateAdminPromotionPackage('pkg-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [url, config] = targetCall;
    expect(String(url)).toContain('/admin/promotions/packages/pkg-1/activate');
    expect(config?.method).toBe('POST');
  });

  it('deactivates a package via POST /admin/promotions/packages/:id/deactivate, not PATCH .../status', async () => {
    const fetchMock = mockFetchOnce();
    await deactivateAdminPromotionPackage('pkg-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [url, config] = targetCall;
    expect(String(url)).toContain('/admin/promotions/packages/pkg-1/deactivate');
    expect(config?.method).toBe('POST');
  });
});
