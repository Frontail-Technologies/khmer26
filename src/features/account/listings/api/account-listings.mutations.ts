import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerKeys } from '@/lib/query/keys';
import { toast } from 'sonner';
import {
  deleteAccountListing,
  markAccountListingSold,
  reactivateAccountListing,
  renewAccountListing,
  applyListingPromotion,
} from './account-listings.api';

function invalidateListings(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: customerKeys.myListings.all });
}

function showMutationError(error: unknown): void {
  toast.error(error instanceof Error ? error.message : 'The listing could not be updated');
}

export function useMarkAccountListingSold() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: markAccountListingSold, onSuccess: () => invalidateListings(queryClient), onError: showMutationError });
}

export function useReactivateAccountListing() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: reactivateAccountListing, onSuccess: () => invalidateListings(queryClient), onError: showMutationError });
}

export function useRenewAccountListing() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: renewAccountListing, onSuccess: () => invalidateListings(queryClient), onError: showMutationError });
}

export function useDeleteAccountListing() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteAccountListing, onSuccess: () => invalidateListings(queryClient), onError: showMutationError });
}

export function useApplyListingPromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyListingPromotion,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.myListings.all });
      queryClient.invalidateQueries({ queryKey: customerKeys.subscription.usage() });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      toast.success(`${result.package.name} activated`);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Promotion could not be activated');
    },
  });
}
