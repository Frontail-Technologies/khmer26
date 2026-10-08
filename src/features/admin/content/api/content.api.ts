import { apiClient } from '@/lib/api/client';
import type {
  HomepageSectionConfig,
  PopularCategoryItem,
  FeaturedSectionItem,
  AdminBannerItem,
  SafetyTipItem,
  BannerPlacement,
  BannerDestinationType,
  SafetyTipContext,
  FeaturedSourceType,
  FeaturedSortMode,
} from '../types';

export interface BackendBannerDto {
  id: string;
  title: string;
  imageUrl: string;
  imageMediaId?: string;
  destinationType: string;
  destinationValue: string | null;
  destinationLabel: string | null;
  placement: string;
  isActive: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
}

export interface BackendFeaturedSectionDto {
  id: string;
  title: string;
  slug: string;
  sourceType: string;
  sortMode?: string | null;
  displayStyle?: string | null;
  isActive: boolean;
  sortOrder: number;
  itemLimit?: number | null;
}

export interface BackendSafetyTipDto {
  id: string;
  tip: string;
  context: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BackendHomeConfigDto {
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  isEnabled: boolean;
  sortOrder: number;
  itemCount?: number | null;
}

export interface BackendPopularCategoryDto {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  imageMediaId: string | null;
  sortOrder: number;
}

export async function getAdminHomepageConfig(): Promise<HomepageSectionConfig[]> {
  const res = await apiClient.get<{ sections: BackendHomeConfigDto[] }>('/admin/content/home');
  const sections = res.data?.sections || [];
  return sections.map((s) => ({
    id: s.sectionKey,
    title: s.title,
    subtitle: s.subtitle || undefined,
    type: s.sectionKey as HomepageSectionConfig['type'],
    isEnabled: s.isEnabled,
    sortOrder: s.sortOrder,
    itemCount: s.itemCount || undefined,
  }));
}

export async function updateAdminHomepageConfig(
  sections: {
    sectionKey: string;
    title?: string;
    subtitle?: string | null;
    isEnabled?: boolean;
    sortOrder?: number;
    itemCount?: number;
  }[]
) {
  return apiClient.patch('/admin/content/home', { sections });
}

export async function getAdminHomepagePopularCategories(): Promise<PopularCategoryItem[]> {
  const res = await apiClient.get<{ categories: BackendPopularCategoryDto[] }>(
    '/admin/content/home/popular-categories'
  );
  return (res.data?.categories || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    imageUrl: '',
    listingCount: 0,
    sortOrder: cat.sortOrder,
  }));
}

export async function updateAdminHomepagePopularCategories(
  categories: Array<{ categoryId: string; sortOrder?: number }>
) {
  return apiClient.patch('/admin/content/home/popular-categories', { categories });
}

export async function getAdminBanners(): Promise<AdminBannerItem[]> {
  const res = await apiClient.get<{ banners: BackendBannerDto[] }>('/admin/content/banners');
  const banners = res.data?.banners || [];
  return banners.map((b) => ({
    id: b.id,
    title: b.title,
    placement: (b.placement || 'homepage_hero') as BannerPlacement,
    imageUrl: b.imageUrl,
    imageMediaId: b.imageMediaId,
    destinationType: (b.destinationType || 'no_action') as BannerDestinationType,
    destinationValue: b.destinationValue || '',
    destinationLabel: b.destinationLabel || undefined,
    startDate: b.startDate || undefined,
    endDate: b.endDate || undefined,
    isActive: b.isActive,
    sortOrder: b.sortOrder || 0,
  }));
}

export async function createAdminBanner(data: {
  title: string;
  imageUrl?: string;
  imageMediaId?: string;
  destinationType: string;
  destinationValue?: string;
  destinationLabel?: string;
  placement?: string;
  sortOrder?: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
}) {
  return apiClient.post('/admin/content/banners', data);
}

export async function updateAdminBanner(
  id: string,
  data: Partial<{
    title: string;
    imageUrl?: string;
    imageMediaId?: string;
    destinationType: string;
    destinationValue: string | null;
    destinationLabel: string | null;
    placement: string;
    sortOrder: number;
    startDate?: string | null;
    endDate?: string | null;
    isActive: boolean;
  }>
) {
  return apiClient.patch(`/admin/content/banners/${id}`, data);
}

export async function activateAdminBanner(id: string) {
  return apiClient.post(`/admin/content/banners/${id}/activate`);
}

export async function deactivateAdminBanner(id: string) {
  return apiClient.post(`/admin/content/banners/${id}/deactivate`);
}

export async function deleteAdminBanner(id: string) {
  return apiClient.delete(`/admin/content/banners/${id}`);
}

export async function getAdminFeaturedSections(): Promise<FeaturedSectionItem[]> {
  const res = await apiClient.get<{ sections: BackendFeaturedSectionDto[] }>('/admin/content/featured-sections');
  const sections = res.data?.sections || [];
  return sections.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    sourceType: (s.sourceType || 'category') as FeaturedSourceType,
    categoryIds: [],
    categoryNames: [],
    sortMode: (s.sortMode || 'recent') as FeaturedSortMode,
    displayStyle: 'grid',
    isActive: s.isActive,
    sortOrder: s.sortOrder || 0,
    itemsCount: s.itemLimit || 0,
  }));
}

export async function createAdminFeaturedSection(data: {
  title: string;
  slug: string;
  sourceType: string;
  sortMode?: string;
  displayStyle?: string;
  isActive?: boolean;
  sortOrder?: number;
  itemLimit?: number;
}) {
  return apiClient.post('/admin/content/featured-sections', data);
}

export async function updateAdminFeaturedSection(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    sourceType: string;
    sortMode: string;
    displayStyle: string;
    isActive: boolean;
    sortOrder: number;
    itemLimit: number;
  }>
) {
  return apiClient.patch(`/admin/content/featured-sections/${id}`, data);
}

export async function deleteAdminFeaturedSection(id: string) {
  return apiClient.delete(`/admin/content/featured-sections/${id}`);
}

export async function getAdminSafetyTips(): Promise<SafetyTipItem[]> {
  const res = await apiClient.get<{ tips: BackendSafetyTipDto[] }>('/admin/content/safety-tips');
  const tips = res.data?.tips || [];
  return tips.map((t) => ({
    id: t.id,
    tip: t.tip,
    context: (t.context || 'listing_detail') as SafetyTipContext,
    isActive: t.isActive,
    sortOrder: t.sortOrder || 0,
  }));
}

export async function createAdminSafetyTip(data: {
  tip: string;
  context: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  return apiClient.post('/admin/content/safety-tips', data);
}

export async function updateAdminSafetyTip(
  id: string,
  data: Partial<{ tip: string; context: string; isActive: boolean; sortOrder: number }>
) {
  return apiClient.patch(`/admin/content/safety-tips/${id}`, data);
}

export async function deleteAdminSafetyTip(id: string) {
  return apiClient.delete(`/admin/content/safety-tips/${id}`);
}

