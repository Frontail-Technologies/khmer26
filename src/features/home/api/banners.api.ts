import { apiClient } from '@/lib/api/client';

export interface PublicBannerItem {
  id: string;
  title: string;
  placement: string;
  imageUrl?: string | null;
  destinationType: string;
  destinationValue?: string | null;
  destinationLabel?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export async function getPublicBanners(placement: string = 'homepage_hero'): Promise<PublicBannerItem[]> {
  try {
    const res = await apiClient.get<{ banners: PublicBannerItem[] }>('/banners', {
      params: { placement },
    });
    return res.data?.banners || [];
  } catch {
    return [];
  }
}
