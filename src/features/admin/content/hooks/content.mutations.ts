import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  updateAdminHomepageConfig,
  updateAdminHomepagePopularCategories,
  createAdminBanner,
  updateAdminBanner,
  activateAdminBanner,
  deactivateAdminBanner,
  createAdminFeaturedSection,
  updateAdminFeaturedSection,
  createAdminSafetyTip,
  updateAdminSafetyTip,
  createAdminStaticPage,
  updateAdminStaticPage,
} from '../api/content.api';
import { toast } from 'sonner';

export function useUpdateHomepageConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminHomepageConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.homeConfig() });
      toast.success('Homepage layout saved');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update homepage configuration';
      toast.error(msg);
    },
  });
}

export function useUpdateHomepagePopularCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminHomepagePopularCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.homePopularCategories() });
      toast.success('Popular categories saved');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update popular categories';
      toast.error(msg);
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.banners() });
      queryClient.invalidateQueries({ queryKey: ["public-banners"] });
      toast.success('Banner created successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create banner';
      toast.error(msg);
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminBanner>[1] }) =>
      updateAdminBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.banners() });
      queryClient.invalidateQueries({ queryKey: ["public-banners"] });
      toast.success('Banner updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update banner';
      toast.error(msg);
    },
  });
}

export function useToggleBannerActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? deactivateAdminBanner(id) : activateAdminBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.banners() });
      queryClient.invalidateQueries({ queryKey: ["public-banners"] });
      toast.success('Banner status updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to toggle banner';
      toast.error(msg);
    },
  });
}

export function useCreateFeaturedSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminFeaturedSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.featuredSections() });
      toast.success('Featured section created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create featured section';
      toast.error(msg);
    },
  });
}

export function useUpdateFeaturedSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminFeaturedSection>[1] }) =>
      updateAdminFeaturedSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.featuredSections() });
      toast.success('Featured section updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update featured section';
      toast.error(msg);
    },
  });
}

export function useCreateSafetyTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminSafetyTip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.safetyTips() });
      toast.success('Safety tip created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create safety tip';
      toast.error(msg);
    },
  });
}

export function useUpdateSafetyTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminSafetyTip>[1] }) =>
      updateAdminSafetyTip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.safetyTips() });
      toast.success('Safety tip updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update safety tip';
      toast.error(msg);
    },
  });
}

export function useCreateStaticPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminStaticPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.staticPages() });
      toast.success('Page created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create page';
      toast.error(msg);
    },
  });
}

export function useUpdateStaticPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Parameters<typeof updateAdminStaticPage>[1] }) =>
      updateAdminStaticPage(slug, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.content.staticPages() });
      queryClient.invalidateQueries({ queryKey: adminKeys.content.staticPage(variables.slug) });
      toast.success('Page updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update page';
      toast.error(msg);
    },
  });
}
