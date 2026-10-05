import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminPayments, getAdminPaymentDetail } from '../api/payments.api';

export function useAdminPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  purpose?: string;
}) {
  return useQuery({
    queryKey: adminKeys.payments.list(params),
    queryFn: () => getAdminPayments(params),
  });
}

export function useAdminPaymentDetail(id: string | null) {
  return useQuery({
    queryKey: adminKeys.payments.detail(id || ''),
    queryFn: () => (id ? getAdminPaymentDetail(id) : null),
    enabled: !!id,
  });
}
