import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  getAdminHomepageConfig,
  getAdminHomepagePopularCategories,
  getAdminBanners,
  getAdminFeaturedSections,
  getAdminSafetyTips,
} from '../api/content.api';

export function useAdminHomepageConfig() {
  return useQuery({
    queryKey: adminKeys.content.homeConfig(),
    queryFn: getAdminHomepageConfig,
  });
}

export function useAdminHomepagePopularCategories() {
  return useQuery({
    queryKey: adminKeys.content.homePopularCategories(),
    queryFn: getAdminHomepagePopularCategories,
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: adminKeys.content.banners(),
    queryFn: getAdminBanners,
  });
}

export function useAdminFeaturedSections() {
  return useQuery({
    queryKey: adminKeys.content.featuredSections(),
    queryFn: getAdminFeaturedSections,
  });
}

export function useAdminSafetyTips() {
  return useQuery({
    queryKey: adminKeys.content.safetyTips(),
    queryFn: getAdminSafetyTips,
  });
}
