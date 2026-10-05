const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-d94191d848734a748c08efbc2783bf65.r2.dev';

/** Builds a public URL for an R2 object key. Returns `url` as-is if already absolute. */
export function getMediaUrl(r2Key: string | null | undefined): string | null {
  if (!r2Key) return null;
  if (/^https?:\/\//i.test(r2Key)) return r2Key;
  return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${r2Key.replace(/^\//, '')}`;
}
