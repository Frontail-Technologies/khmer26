import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAdminHomepageConfig } from './content.api';

function mockApiFetch(body: unknown) {
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

describe('CMS homepage config contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads homepage config from GET /admin/content/home, not /admin/content/home-config', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { sections: [] } });
    await getAdminHomepageConfig();

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/content/home');
    expect(String(targetCall[0])).not.toContain('/admin/content/home-config');
  });
});
