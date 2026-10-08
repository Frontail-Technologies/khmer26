const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export type ServerCategoryLookup =
  | { status: 'found'; nameEn: string }
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
    const json = (await res.json()) as { data?: { category?: { nameEn?: string } } };
    const nameEn = json.data?.category?.nameEn;
    return nameEn ? { status: 'found', nameEn } : { status: 'unknown' };
  } catch {
    return { status: 'unknown' };
  }
}
