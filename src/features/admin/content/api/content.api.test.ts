import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAdminStaticPages, createAdminStaticPage, getAdminHomepageConfig } from './content.api';

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

describe('CMS static page contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists static pages via GET /admin/content/pages', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { pages: [] } });
    await getAdminStaticPages();

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/content/pages');
  });

  it('creates a static page via POST /admin/content/pages', async () => {
    const fetchMock = mockApiFetch({ success: true, data: {} });
    await createAdminStaticPage({ slug: 'terms', title: 'Terms', content: 'Body text' });

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/content/pages');
    expect(targetCall[1]?.method).toBe('POST');
  });

  it('reads homepage config from GET /admin/content/home, not /admin/content/home-config', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { sections: [] } });
    await getAdminHomepageConfig();

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/content/home');
    expect(String(targetCall[0])).not.toContain('/admin/content/home-config');
  });
});
