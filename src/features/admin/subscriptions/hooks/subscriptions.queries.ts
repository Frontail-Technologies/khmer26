import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminSubscribers, getAdminSubscriptionPlans } from '../api/subscriptions.api';

export function useAdminSubscriptionPlans() {
  return useQuery({
    queryKey: adminKeys.subscriptions.plans(),
    queryFn: getAdminSubscriptionPlans,
  });
}

export function useAdminSubscribers() {
  return useQuery({
    queryKey: adminKeys.subscriptions.list(),
    queryFn: getAdminSubscribers,
  });
}
