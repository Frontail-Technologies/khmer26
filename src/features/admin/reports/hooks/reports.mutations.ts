import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  resolveReport,
  dismissReport,
  createAdminReportReason,
  updateAdminReportReason,
  deleteAdminReportReason,
} from '../api/reports.api';
import type { AdminReportReasonItem, AdminReportTargetType } from '../types';
import { toast } from 'sonner';

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => resolveReport(id, notes),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Report resolved');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to resolve report';
      toast.error(msg);
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => dismissReport(id, notes),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard.all });
      toast.success('Report dismissed');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to dismiss report';
      toast.error(msg);
    },
  });
}

export function useCreateReportReason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { label: string; description?: string; appliesTo: AdminReportTargetType[] }) =>
      createAdminReportReason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.reasons() });
      toast.success('Report reason created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create report reason';
      toast.error(msg);
    },
  });
}

export function useUpdateReportReason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Pick<AdminReportReasonItem, 'label' | 'description' | 'isActive' | 'appliesTo'>>) =>
      updateAdminReportReason(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.reasons() });
      toast.success('Report reason updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update report reason';
      toast.error(msg);
    },
  });
}

export function useDeleteReportReason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminReportReason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports.reasons() });
      toast.success('Report reason deleted');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete report reason';
      toast.error(msg);
    },
  });
}
