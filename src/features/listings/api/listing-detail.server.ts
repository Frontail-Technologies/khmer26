import { getMediaUrl } from '@/lib/media/get-media-url';
import { formatListingPrice } from '../lib/listing-detail-format';
import type { ListingDetail } from './listing-detail.api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ListingMeta {
  title: string;
  description: string;
  imageUrl: string | null;
}

/** Server-side, anonymous lookup used only for page metadata. Non-public listings return null. */
export async function lookupListingMeta(id: string): Promise<ListingMeta | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { listing?: ListingDetail } };
    const listing = json.data?.listing;
    if (!listing) return null;
    const first = [...listing.media].sort((a, b) => a.displayOrder - b.displayOrder)[0];
    return {
      title: `${listing.title} — ${formatListingPrice(listing)}`,
      description: (listing.description ?? listing.title).slice(0, 160),
      imageUrl: first ? getMediaUrl(first.r2Key) : null,
    };
  } catch {
    return null;
  }
}
