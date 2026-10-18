import { getApiBaseUrl } from '@/lib/api/base-url';

const API_BASE_URL = getApiBaseUrl();

export type ServerCategoryLookup =
  | { status: 'found'; nameEn: string; nameKm: string | null }
  | { status: 'not-found' }
  | { status: 'unknown' };

/** Server-only lookup used for real 404s and page metadata. Network failures are 'unknown', never 'not-found'. */
export async function lookupCategoryBySlug(slug: string): Promise<ServerCategoryLookup> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (res.status === 404) return { status: 'not-found' };
    if (!res.ok) return { status: 'unknown' };
    const json = (await res.json()) as { data?: { category?: { nameEn?: string; nameKm?: string | null } } };
    const nameEn = json.data?.category?.nameEn;
    return nameEn ? { status: 'found', nameEn, nameKm: json.data?.category?.nameKm ?? null } : { status: 'unknown' };
  } catch {
    return { status: 'unknown' };
  }
}
