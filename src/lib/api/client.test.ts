import { describe, expect, it, vi, beforeEach } from 'vitest';
import { apiClient, ApiError } from './client';

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => body,
  };
}

const expiredPayload = {
  success: false,
  error: {
    code: 'UNAUTHORIZED',
    message: 'Access token is invalid or expired',
    details: { code: 'SESSION_EXPIRED' },
  },
};

const refreshOkPayload = { success: true, data: { csrfToken: 'new-csrf' } };

describe('apiClient access-token refresh flow', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('transparently refreshes and retries after an expired-access-token 401 (real backend shape: error.code === "UNAUTHORIZED")', async () => {
    const fetchMock = vi.fn();
    let call = 0;
    fetchMock.mockImplementation(async (url: string) => {
      call += 1;
      const u = String(url);
      if (u.includes('/admin/dashboard')) {
        if (call === 1) return jsonResponse(401, expiredPayload);
        return jsonResponse(200, { success: true, data: { ok: true } });
      }
      if (u.includes('/auth/refresh')) {
        return jsonResponse(200, refreshOkPayload);
      }
      throw new Error(`Unexpected fetch to ${u}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await apiClient.get('/admin/dashboard');

    expect(result).toEqual({ success: true, data: { ok: true } });
    const calledUrls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(calledUrls.filter((u) => u.includes('/admin/dashboard'))).toHaveLength(2);
    expect(calledUrls.some((u) => u.includes('/auth/refresh'))).toBe(true);
  });

  it('5 concurrent expired requests produce exactly one refresh', async () => {
    let refreshCount = 0;
    let dashboardCallCount = 0;

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url);
      if (u.includes('/auth/refresh')) {
        refreshCount++;
        await new Promise((r) => setTimeout(r, 10));
        return jsonResponse(200, refreshOkPayload);
      }
      if (u.includes('/admin/dashboard')) {
        dashboardCallCount++;
        if (dashboardCallCount <= 5) {
          return jsonResponse(401, expiredPayload);
        }
        return jsonResponse(200, { success: true, data: { ok: true } });
      }
      throw new Error(`Unexpected fetch to ${u}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const results = await Promise.all([
      apiClient.get('/admin/dashboard'),
      apiClient.get('/admin/dashboard'),
      apiClient.get('/admin/dashboard'),
      apiClient.get('/admin/dashboard'),
      apiClient.get('/admin/dashboard'),
    ]);

    expect(refreshCount).toBe(1);
    for (const r of results) {
      expect((r as { data: { ok: boolean } }).data.ok).toBe(true);
    }
  });

  it('surfaces the original 401 when the refresh attempt itself fails, without looping', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url);
      if (u.includes('/admin/dashboard')) {
        return jsonResponse(401, expiredPayload);
      }
      if (u.includes('/auth/refresh')) {
        return jsonResponse(401, {
          success: false,
          error: { code: 'SESSION_EXPIRED', message: 'Session has expired or was revoked' },
        });
      }
      throw new Error(`Unexpected fetch to ${u}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.get('/admin/dashboard')).rejects.toThrow(ApiError);

    const calledUrls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(calledUrls.filter((u) => u.includes('/admin/dashboard'))).toHaveLength(1);
    expect(calledUrls.filter((u) => u.includes('/auth/refresh'))).toHaveLength(1);
  });

  it('never attempts a refresh for a 401 coming from the refresh endpoint itself', async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      jsonResponse(401, { success: false, error: { code: 'SESSION_EXPIRED', message: 'no session' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.post('/auth/refresh')).rejects.toThrow(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does NOT loop when the retried request also returns 401', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url);
      if (u.includes('/auth/refresh')) {
        return jsonResponse(200, refreshOkPayload);
      }
      // Both the original request AND the retry return 401
      return jsonResponse(401, expiredPayload);
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.get('/admin/dashboard')).rejects.toThrow(ApiError);

    const calledUrls = fetchMock.mock.calls.map((c) => String(c[0]));
    // Original + 1 refresh + 1 retry — never more
    expect(calledUrls.filter((u) => u.includes('/admin/dashboard'))).toHaveLength(2);
    expect(calledUrls.filter((u) => u.includes('/auth/refresh'))).toHaveLength(1);
  });

  it('does NOT trigger a refresh for a 403 Forbidden response', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url);
      if (u.includes('/admin/dashboard')) {
        return jsonResponse(403, {
          success: false,
          error: { code: 'FORBIDDEN', message: 'Access denied' },
        });
      }
      throw new Error(`Unexpected fetch to ${u}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.get('/admin/dashboard')).rejects.toThrow(ApiError);

    const calledUrls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(calledUrls.filter((u) => u.includes('/auth/refresh'))).toHaveLength(0);
    expect(calledUrls).toHaveLength(1);
  });

  it('does NOT trigger logout/auth-reset for a network error', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const err = await apiClient.get('/admin/dashboard').catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe('NETWORK_ERROR');
    // Only one fetch attempt, no refresh call
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
