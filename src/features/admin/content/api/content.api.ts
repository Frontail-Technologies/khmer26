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
  AdminContentPage,
  ContentPageSlug,
  ContentPageSection,
  ModerationKeywordItem,
} from '../types';

export interface BackendBannerDto {
  id: string;
  title: string;
  titleKm?: string | null;
  imageUrl: string;
  imageMediaId?: string;
  destinationType: string;
  destinationValue: string | null;
  destinationLabel: string | null;
  destinationLabelKm?: string | null;
  placement: string;
  isActive: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
}

export interface BackendFeaturedSectionDto {
  id: string;
  title: string;
  titleKm?: string | null;
  slug: string;
  sourceType: string;
  sortMode?: string | null;
  displayStyle?: string | null;
  isActive: boolean;
  sortOrder: number;
  itemLimit?: number | null;
  categoryIds?: string[];
  categoryNames?: string[];
}

export interface BackendSafetyTipDto {
  id: string;
  tip: string;
  tipKm?: string | null;
  context: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BackendHomeConfigDto {
  sectionKey: string;
  title: string;
  titleKm?: string | null;
  subtitle?: string | null;
  subtitleKm?: string | null;
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
    titleKm: s.titleKm ?? null,
    subtitle: s.subtitle || undefined,
    subtitleKm: s.subtitleKm ?? null,
    type: s.sectionKey as HomepageSectionConfig['type'],
    isEnabled: s.isEnabled,
    sortOrder: s.sortOrder,
    itemCount: s.itemCount || undefined,
  }));
}

export async function updateAdminHomepageConfig(data: {
  sections: {
    sectionKey: string;
    title?: string;
    titleKm?: string | null;
    subtitle?: string | null;
    subtitleKm?: string | null;
    isEnabled?: boolean;
    sortOrder?: number;
    itemCount?: number;
  }[];
  featuredSections?: Array<{ id: string; isActive?: boolean; sortOrder: number }>;
  banners?: Array<{ id: string; isActive?: boolean; sortOrder: number }>;
}) {
  return apiClient.patch('/admin/content/home', data);
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
    titleKm: b.titleKm ?? null,
    placement: (b.placement || 'homepage_hero') as BannerPlacement,
    imageUrl: b.imageUrl,
    imageMediaId: b.imageMediaId,
    destinationType: (b.destinationType || 'no_action') as BannerDestinationType,
    destinationValue: b.destinationValue || '',
    destinationLabel: b.destinationLabel || undefined,
    destinationLabelKm: b.destinationLabelKm ?? null,
    startDate: b.startDate || undefined,
    endDate: b.endDate || undefined,
    isActive: b.isActive,
    sortOrder: b.sortOrder || 0,
  }));
}

export async function createAdminBanner(data: {
  title: string;
  titleKm?: string | null;
  imageUrl?: string;
  imageMediaId?: string;
  destinationType: string;
  destinationValue?: string;
  destinationLabel?: string;
  destinationLabelKm?: string | null;
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
    titleKm: string | null;
    imageUrl?: string;
    imageMediaId?: string;
    destinationType: string;
    destinationValue: string | null;
    destinationLabel: string | null;
    destinationLabelKm: string | null;
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
    titleKm: s.titleKm ?? null,
    slug: s.slug,
    sourceType: (s.sourceType || 'category') as FeaturedSourceType,
    categoryIds: s.categoryIds || [],
    categoryNames: s.categoryNames || [],
    sortMode: (s.sortMode || 'recent') as FeaturedSortMode,
    displayStyle: 'grid',
    isActive: s.isActive,
    sortOrder: s.sortOrder || 0,
    itemsCount: s.itemLimit || 0,
  }));
}

export async function createAdminFeaturedSection(data: {
  title: string;
  titleKm?: string | null;
  slug: string;
  sourceType: string;
  sortMode?: string;
  displayStyle?: string;
  isActive?: boolean;
  sortOrder?: number;
  itemLimit?: number;
  categoryIds?: string[];
}) {
  return apiClient.post('/admin/content/featured-sections', data);
}

export async function updateAdminFeaturedSection(
  id: string,
  data: Partial<{
    title: string;
    titleKm: string | null;
    slug: string;
    sourceType: string;
    sortMode: string;
    displayStyle: string;
    isActive: boolean;
    sortOrder: number;
    itemLimit: number;
    categoryIds: string[];
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
    tipKm: t.tipKm ?? null,
    context: (t.context || 'listing_detail') as SafetyTipContext,
    isActive: t.isActive,
    sortOrder: t.sortOrder || 0,
  }));
}

export async function createAdminSafetyTip(data: {
  tip: string;
  tipKm?: string | null;
  context: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  return apiClient.post('/admin/content/safety-tips', data);
}

export async function updateAdminSafetyTip(
  id: string,
  data: Partial<{ tip: string; tipKm: string | null; context: string; isActive: boolean; sortOrder: number }>
) {
  return apiClient.patch(`/admin/content/safety-tips/${id}`, data);
}

export async function deleteAdminSafetyTip(id: string) {
  return apiClient.delete(`/admin/content/safety-tips/${id}`);
}

export async function getAdminContentPages(): Promise<AdminContentPage[]> {
  const response = await apiClient.get<{ pages: AdminContentPage[] }>('/admin/content/pages');
  return response.data?.pages ?? [];
}

export async function updateAdminContentPage(
  slug: ContentPageSlug,
  data: {
    eyebrow?: string;
    title?: string;
    summary?: string;
    sections?: ContentPageSection[];
    eyebrowKm?: string | null;
    titleKm?: string | null;
    summaryKm?: string | null;
    sectionsKm?: ContentPageSection[] | null;
    isPublished?: boolean;
  }
): Promise<AdminContentPage> {
  const response = await apiClient.patch<{ page: AdminContentPage }>(`/admin/content/pages/${slug}`, data);
  return response.data!.page;
}

export async function getAdminModerationKeywords(): Promise<ModerationKeywordItem[]> {
  const response = await apiClient.get<{ keywords: ModerationKeywordItem[] }>('/admin/content/moderation-keywords');
  return response.data?.keywords ?? [];
}

export async function createAdminModerationKeyword(data: {
  keyword: string;
  guidance?: string | null;
  isActive?: boolean;
}) {
  return apiClient.post('/admin/content/moderation-keywords', data);
}

export async function updateAdminModerationKeyword(
  id: string,
  data: Partial<{ keyword: string; guidance: string | null; isActive: boolean }>
) {
  return apiClient.patch(`/admin/content/moderation-keywords/${id}`, data);
}

export async function deleteAdminModerationKeyword(id: string) {
  return apiClient.delete(`/admin/content/moderation-keywords/${id}`);
}

