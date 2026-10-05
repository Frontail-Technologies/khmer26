import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  getAdminVerifications,
  getAdminVerification,
  type AdminVerificationsQueryParams,
} from '../api/verifications.api';

export function useAdminVerifications(params: AdminVerificationsQueryParams) {
  return useQuery({
    queryKey: adminKeys.verifications.list(params),
    queryFn: () => getAdminVerifications(params),
  });
}

export function useAdminVerificationDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.verifications.detail(id),
    queryFn: () => getAdminVerification(id),
    enabled: !!id,
  });
}
