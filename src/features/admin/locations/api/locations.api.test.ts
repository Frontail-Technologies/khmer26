import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAdminProvinces, createAdminDistrict } from './locations.api';

function mockFetch(responses: Record<string, unknown>) {
  const fetchMock = vi.fn().mockImplementation(async (url: string | URL) => {
    const urlStr = String(url);
    if (urlStr.includes('/auth/csrf')) {
      return {
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { csrfToken: 'test-csrf' } }),
      };
    }
    const key = Object.keys(responses).find((k) => urlStr.includes(k));
    return {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => (key ? responses[key] : { success: true, data: [] }),
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('location query contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('derives province/district data from the list endpoints only, never a fake per-province detail route', async () => {
    const fetchMock = mockFetch({
      '/admin/locations/provinces': { success: true, data: [{ id: 1, nameEn: 'Phnom Penh', slug: 'phnom-penh', isActive: true }] },
      '/admin/locations/districts': { success: true, data: [{ id: 10, provinceId: 1, nameEn: 'Chamkarmon', slug: 'chamkarmon', isActive: true }] },
    });

    const provinces = await getAdminProvinces();

    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(urls.some((u) => u.includes('/admin/locations/provinces'))).toBe(true);
    expect(urls.some((u) => u.includes('/admin/locations/districts'))).toBe(true);
    expect(urls.some((u) => /\/admin\/locations\/provinces\/\d+$/.test(u))).toBe(false);
    expect(provinces[0]!.districts).toHaveLength(1);
  });

  it('creates a district with the required type field the real schema demands', async () => {
    const fetchMock = mockFetch({ '/admin/locations/districts': { success: true, data: {} } });
    await createAdminDistrict({
      id: 99,
      provinceId: 1,
      nameEn: 'Test District',
      nameKm: 'តេស្ត',
      slug: 'test-district',
      type: 'khan',
    });

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [, config] = targetCall;
    const body = JSON.parse(String(config?.body));
    expect(body.type).toBe('khan');
  });
});
