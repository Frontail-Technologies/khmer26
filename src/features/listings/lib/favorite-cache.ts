/**
 * Applies a favorite flag to every cached shape that can contain the listing:
 * the detail DTO, home, similar arrays and infinite search pages. Unknown shapes pass through.
 */
export function patchFavoriteInData(data: unknown, listingId: string, favorited: boolean): unknown {
  if (Array.isArray(data)) return data.map((item) => patchFavoriteInData(item, listingId, favorited))
  if (!data || typeof data !== "object") return data

  const record = data as Record<string, unknown>

  if (record.id === listingId && "isFavorited" in record) {
    return { ...record, isFavorited: favorited }
  }
  if (Array.isArray(record.pages)) {
    return { ...record, pages: record.pages.map((p) => patchFavoriteInData(p, listingId, favorited)) }
  }
  if (Array.isArray(record.items)) {
    return { ...record, items: patchFavoriteInData(record.items, listingId, favorited) }
  }
  if (Array.isArray(record.newListings)) {
    return { ...record, newListings: patchFavoriteInData(record.newListings, listingId, favorited) }
  }
  return data
}
