import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  approveListing,
  rejectListing,
  suspendListing,
  restoreListing,
  deleteListing,
  updateAdminListing,
} from '../api/listings.api';
import { toast } from 'sonner';

export function useApproveListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveListing,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Listing approved');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to approve listing';
      toast.error(msg);
    },
  });
}

export function useRejectListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectListing(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Listing rejected');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to reject listing';
      toast.error(msg);
    },
  });
}

export function useSuspendListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => suspendListing(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Listing suspended');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to suspend listing';
      toast.error(msg);
    },
  });
}

export function useRestoreListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreListing,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Listing restored');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to restore listing';
      toast.error(msg);
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteListing,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Listing deleted');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete listing';
      toast.error(msg);
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminListing>[1] }) =>
      updateAdminListing(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.listings.detail(variables.id) });
      toast.success('Listing updated successfully');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update listing';
      toast.error(msg);
    },
  });
}
