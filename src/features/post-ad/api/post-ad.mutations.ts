import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerKeys, marketplaceKeys } from '@/lib/query/keys';
import {
  createListing,
  submitListing,
  updateListing,
  type CreateListingInput,
} from './post-ad.api';

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, isDraft }: { input: CreateListingInput; isDraft: boolean }) =>
      createListing(input, isDraft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.myListings.all });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.listings.all });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
      submit,
    }: {
      id: string;
      input: CreateListingInput;
      submit: boolean;
    }) => {
      const listing = await updateListing(id, input);
      return submit ? submitListing(id) : listing;
    },
    onSuccess: (_listing, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.myListings.all });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.listings.detail(variables.id) });
    },
  });
}
