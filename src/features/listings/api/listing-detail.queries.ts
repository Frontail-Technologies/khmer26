import { queryOptions, useQuery } from '@tanstack/react-query';
import { marketplaceKeys } from '@/lib/query/keys';
import {
  getListing,
  getReportReasons,
  getSellerListings,
  getSimilarListings,
} from './listing-detail.api';

export const listingDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: marketplaceKeys.listings.detail(id),
    queryFn: () => getListing(id),
    staleTime: 30_000,
    retry: false,
  });

export function useListingDetail(id: string) {
  return useQuery(listingDetailQueryOptions(id));
}

export function useSimilarListings(id: string, enabled: boolean) {
  return useQuery({
    queryKey: marketplaceKeys.listings.similar(id),
    queryFn: () => getSimilarListings(id, 12),
    enabled,
    staleTime: 60_000,
  });
}

export function useSellerListings(sellerId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: marketplaceKeys.listings.bySeller(sellerId ?? ''),
    queryFn: () => getSellerListings(sellerId!),
    enabled: enabled && Boolean(sellerId),
    staleTime: 60_000,
  });
}

export function useReportReasons(enabled: boolean) {
  return useQuery({
    queryKey: marketplaceKeys.reports.reasons('listing'),
    queryFn: () => getReportReasons('listing'),
    enabled,
    staleTime: 5 * 60_000,
  });
}
