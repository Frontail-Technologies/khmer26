import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  createAdminCommune,
  createAdminDistrict,
  createAdminProvince,
  updateAdminCommune,
  updateAdminDistrict,
  updateAdminProvince,
} from '../api/locations.api';
import { toast } from 'sonner';

export function useCreateAdminProvince() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: number;
      nameEn: string;
      nameKm: string;
      slug: string;
      isCapital?: boolean;
      isActive?: boolean;
    }) => createAdminProvince(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations.all });
      toast.success('Province created successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create province';
      toast.error(msg);
    },
  });
}

export function useUpdateAdminProvince() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { nameEn?: string; nameKm?: string; slug?: string; isActive?: boolean } }) =>
      updateAdminProvince(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations.all });
      toast.success('Province updated successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update province';
      toast.error(msg);
    },
  });
}

export function useCreateAdminDistrict() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: number;
      provinceId: number;
      nameEn: string;
      nameKm: string;
      slug: string;
      type: 'district' | 'municipality' | 'khan';
      isActive?: boolean;
    }) => createAdminDistrict(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations.all });
      toast.success('District created successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create district';
      toast.error(msg);
    },
  });
}

export function useUpdateAdminDistrict() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { nameEn?: string; nameKm?: string; slug?: string; isActive?: boolean } }) =>
      updateAdminDistrict(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations.all });
      toast.success('District updated successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update district';
      toast.error(msg);
    },
  });
}

export function useCreateAdminCommune() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: number;
      districtId: number;
      nameEn: string;
      nameKm: string;
      slug: string;
      type: 'commune' | 'sangkat';
      isActive?: boolean;
    }) => createAdminCommune(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations.all });
      toast.success('Commune created successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create commune';
      toast.error(msg);
    },
  });
}

export function useUpdateAdminCommune() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { nameEn?: string; nameKm?: string; slug?: string; isActive?: boolean } }) =>
      updateAdminCommune(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.locations.all });
      toast.success('Commune updated successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update commune';
      toast.error(msg);
    },
  });
}
