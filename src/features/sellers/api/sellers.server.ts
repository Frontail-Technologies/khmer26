import { getApiBaseUrl } from '@/lib/api/base-url';
import { getMediaUrl } from '@/lib/media/get-media-url';
import type { SellerProfile } from './sellers.api';

const API_BASE_URL = getApiBaseUrl();

export interface SellerMeta {
  title: string;
  description: string;
  imageUrl: string | null;
}

/** Server-side, anonymous lookup used only for page metadata. Hidden sellers return null. */
export async function lookupSellerMeta(id: string): Promise<SellerMeta | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/sellers/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { profile?: SellerProfile } };
    const seller = json.data?.profile;
    if (!seller) return null;
    return {
      title: `${seller.shopName} — Khmer26 Seller`,
      description: (seller.bio?.trim() || `${seller.shopName} on Khmer26`).slice(0, 160),
      imageUrl: getMediaUrl(seller.avatarR2Key),
    };
  } catch {
    return null;
  }
}
