import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminListings, getAdminListing, type AdminListingsQueryParams } from '../api/listings.api';

export function useAdminListings(params: AdminListingsQueryParams) {
  return useQuery({
    queryKey: adminKeys.listings.list(params),
    queryFn: () => getAdminListings(params),
  });
}

export function useAdminListingDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.listings.detail(id),
    queryFn: () => getAdminListing(id),
    enabled: !!id,
  });
}
