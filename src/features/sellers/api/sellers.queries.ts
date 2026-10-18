import { keepPreviousData, queryOptions, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { marketplaceKeys } from '@/lib/query/keys';
import {
  createReview,
  getSeller,
  getSellerCategories,
  getSellerListingsPage,
  getSellerReportReasons,
  getSellerReviewsPage,
  getReviewEligibility,
  reportSeller,
  type CreateReviewInput,
  type SellerListingFilters,
} from './sellers.api';

export const SELLER_LISTINGS_PAGE_SIZE = 12;
export const SELLER_REVIEWS_PAGE_SIZE = 10;

export const sellerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: marketplaceKeys.sellers.detail(id),
    queryFn: () => getSeller(id),
    staleTime: 30_000,
    retry: false,
  });

export function useSeller(id: string) {
  return useQuery(sellerQueryOptions(id));
}

export function useSellerListingsInfinite(id: string, enabled = true, filters: SellerListingFilters = {}) {
  // Only non-default filters go into the key, so the unfiltered inventory keeps one cache entry.
  const params = {
    limit: SELLER_LISTINGS_PAGE_SIZE,
    ...(filters.q?.trim() ? { q: filters.q.trim() } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.sort && filters.sort !== 'newest' ? { sort: filters.sort } : {}),
  };
  return useInfiniteQuery({
    queryKey: marketplaceKeys.sellers.listings(id, params),
    queryFn: ({ pageParam }) =>
      getSellerListingsPage(id, { page: pageParam, limit: SELLER_LISTINGS_PAGE_SIZE }, filters),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useSellerCategories(id: string, enabled = true) {
  return useQuery({
    queryKey: marketplaceKeys.sellers.categories(id),
    queryFn: () => getSellerCategories(id),
    enabled,
    staleTime: 60_000,
  });
}

export function useSellerReviewsInfinite(id: string, enabled = true) {
  const params = { limit: SELLER_REVIEWS_PAGE_SIZE };
  return useInfiniteQuery({
    queryKey: marketplaceKeys.sellers.reviews(id, params),
    queryFn: ({ pageParam }) => getSellerReviewsPage(id, { page: pageParam, limit: params.limit }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    enabled,
    staleTime: 30_000,
  });
}

export function useReviewEligibility(sellerId: string, enabled = true) {
  return useQuery({
    queryKey: marketplaceKeys.sellers.reviewEligibility(sellerId),
    queryFn: () => getReviewEligibility(sellerId),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}

export function useSellerReportReasons(enabled: boolean) {
  return useQuery({
    queryKey: marketplaceKeys.reports.reasons('seller'),
    queryFn: getSellerReportReasons,
    enabled,
    staleTime: 5 * 60_000,
  });
}

/** A new review changes the seller's rating summary and the review list — nothing else. */
export function useSubmitReview(sellerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CreateReviewInput, 'sellerProfileId'>) =>
      createReview({ ...input, sellerProfileId: sellerId }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: marketplaceKeys.sellers.detail(sellerId) }),
        queryClient.invalidateQueries({
          queryKey: [...marketplaceKeys.sellers.all, 'reviews', sellerId],
        }),
        queryClient.invalidateQueries({
          queryKey: marketplaceKeys.sellers.reviewEligibility(sellerId),
        }),
      ]);
    },
  });
}

/** Reporting changes no public data, so it invalidates nothing. */
export function useReportSeller(sellerId: string) {
  return useMutation({
    mutationFn: (input: { reasonId: string; details?: string }) => reportSeller(sellerId, input),
  });
}
