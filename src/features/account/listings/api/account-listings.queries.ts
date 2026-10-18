import { useQuery } from '@tanstack/react-query';
import { customerKeys } from '@/lib/query/keys';
import { getAccountListings, getPromotionPackages, type AccountListingsQuery } from './account-listings.api';

export function useAccountListings(params: AccountListingsQuery = {}) {
  return useQuery({
    queryKey: customerKeys.myListings.list({ ...params }),
    queryFn: () => getAccountListings(params),
  });
}

export function usePromotionPackages() {
  return useQuery({
    queryKey: customerKeys.promotions.packages(),
    queryFn: getPromotionPackages,
    staleTime: 5 * 60_000,
  });
}
