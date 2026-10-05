import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  createAdminSubscriptionPlan,
  updateAdminSubscriptionPlan,
  deactivateAdminSubscriptionPlan,
} from '../api/subscriptions.api';
import { toast } from 'sonner';

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions.all });
      toast.success('Subscription plan created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create plan';
      toast.error(msg);
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminSubscriptionPlan>[1] }) =>
      updateAdminSubscriptionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions.all });
      toast.success('Subscription plan updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update plan';
      toast.error(msg);
    },
  });
}

export function useDeactivateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateAdminSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions.all });
      toast.success('Subscription plan deactivated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to deactivate plan';
      toast.error(msg);
    },
  });
}
