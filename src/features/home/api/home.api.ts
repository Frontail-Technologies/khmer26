import { apiClient } from '@/lib/api/client';
import type { PublicListing } from '@/features/listings/api/listings.api';

export interface HomeSection {
  id: string;
  sectionKey: string;
  title: string;
  titleKm?: string | null;
  subtitle: string | null;
  subtitleKm?: string | null;
  isEnabled: boolean;
  sortOrder: number;
  itemCount: number | null;
}

export interface HomeBanner {
  id: string;
  title: string;
  titleKm?: string | null;
  placement: string;
  imageR2Key: string | null;
  mobileImageR2Key: string | null;
  destinationType: string;
  destinationValue: string | null;
  destinationLabel: string | null;
  destinationLabelKm?: string | null;
  sortOrder: number;
}

export interface HomeFeaturedSection {
  id: string;
  title: string;
  titleKm?: string | null;
  slug: string;
  sourceType: string;
  sortMode: string;
  displayStyle: string;
  isActive: boolean;
  sortOrder: number;
  itemLimit: number;
  categoryIds: string[];
  listings: HomeListing[];
}

export interface HomePopularCategory {
  id: string;
  name: string;
  nameKm?: string | null;
  slug: string;
  parentId: string | null;
  imageR2Key: string | null;
  sortOrder: number;
}

export interface HomeSafetyTip {
  id: string;
  tip: string;
  tipKm?: string | null;
  context: string;
  isActive: boolean;
  sortOrder: number;
}

export type HomeListing = PublicListing;

export interface HomeResponse {
  sections: HomeSection[];
  banners: HomeBanner[];
  featuredSections: HomeFeaturedSection[];
  popularCategories: HomePopularCategory[];
  safetyTips: HomeSafetyTip[];
  newListings: HomeListing[];
}

export async function getHome(): Promise<HomeResponse> {
  const res = await apiClient.get<HomeResponse>('/home');
  return res.data;
}
