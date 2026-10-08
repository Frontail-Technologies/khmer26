/** Builds a public URL for a persisted media key. Returns null when it cannot be resolved. */
export function getMediaUrl(r2Key: string | null | undefined): string | null {
  if (!r2Key) return null;
  const key = r2Key.trim();
  if (!key) return null;
  if (/^https?:\/\//i.test(key)) return key;
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/${key.replace(/^\/+/, '')}`;
}
