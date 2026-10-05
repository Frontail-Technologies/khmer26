import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  createAdminPromotionPackage,
  updateAdminPromotionPackage,
  activateAdminPromotionPackage,
  deactivateAdminPromotionPackage,
} from '../api/promotions.api';
import { toast } from 'sonner';

export function useCreatePromotionPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminPromotionPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.promotions.all });
      toast.success('Promotion package created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create package';
      toast.error(msg);
    },
  });
}

export function useUpdatePromotionPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminPromotionPackage>[1] }) =>
      updateAdminPromotionPackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.promotions.all });
      toast.success('Promotion package updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update package';
      toast.error(msg);
    },
  });
}

export function useTogglePromotionPackageActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? deactivateAdminPromotionPackage(id) : activateAdminPromotionPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.promotions.all });
      toast.success('Package status updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to toggle package status';
      toast.error(msg);
    },
  });
}
