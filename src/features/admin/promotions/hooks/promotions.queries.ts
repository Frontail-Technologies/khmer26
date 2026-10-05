import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminPromotionPackages, getAdminActivePromotions } from '../api/promotions.api';

export function useAdminPromotionPackages() {
  return useQuery({
    queryKey: adminKeys.promotions.packages(),
    queryFn: getAdminPromotionPackages,
  });
}

export function useAdminActivePromotions(params: { status?: 'active' | 'expired' } = {}) {
  return useQuery({
    queryKey: adminKeys.promotions.active(params),
    queryFn: () => getAdminActivePromotions(params),
  });
}
