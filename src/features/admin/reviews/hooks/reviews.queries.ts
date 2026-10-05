import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminReviews } from '../api/reviews.api';

export function useAdminReviews(params?: { page?: number; limit?: number; visibility?: string }) {
  return useQuery({
    queryKey: adminKeys.reviews.list(params),
    queryFn: () => getAdminReviews(params),
  });
}
