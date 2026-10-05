import { apiClient } from '@/lib/api/client';
import type {
  AdminReport,
  AdminReportReasonItem,
  AdminReportStatus,
  AdminReportTargetType,
  RawReportRow,
} from '../types';

export interface AdminReportsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  targetType?: string;
  search?: string;
  q?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export function normalizeReportRow(row: RawReportRow | Record<string, unknown>) {
  if (row && typeof row === 'object' && 'targetId' in row && 'reason' in row && !('report' in row)) {
    return row;
  }
  const r = (row as RawReportRow).report;
  const targetId =
    r.targetType === 'listing'
      ? r.listingId
      : r.targetType === 'user'
      ? r.userId
      : r.targetType === 'seller'
      ? r.sellerProfileId
      : r.conversationId || r.id;

  return {
    id: r.id,
    targetType: r.targetType as AdminReportTargetType,
    targetId: targetId ?? r.id,
    reason: (row as RawReportRow).reason?.label || 'Unknown reason',
    details: r.details || '',
    status: r.status,
    createdAt: r.createdAt,
    resolvedAt: r.resolvedAt,
  };
}

export function normalizeReport(row: RawReportRow | AdminReport | Record<string, unknown>): AdminReport {
  if (row && typeof row === 'object' && 'target' in row && 'reasonLabel' in row && 'reporter' in row) {
    return row as AdminReport;
  }

  const statusMap: Record<string, AdminReportStatus> = {
    open: 'open',
    in_review: 'in_review',
    resolved: 'resolved',
    dismissed: 'dismissed',
  };

  const r = (row as RawReportRow).report;
  const targetType = r.targetType as AdminReportTargetType;
  const targetId =
    targetType === 'listing'
      ? r.listingId
      : targetType === 'user'
      ? r.userId
      : targetType === 'seller'
      ? r.sellerProfileId
      : r.conversationId || r.id;

  const target = {
    type: targetType,
    id: (targetId ?? r.id) as string,
    title: `${targetType.charAt(0).toUpperCase()}${targetType.slice(1)} ${targetId ?? r.id}`,
    href: targetType === 'listing' ? `/admin/listings/${targetId}` : `/admin/users/${targetId}`,
  };

  const rawReason = (row as Record<string, unknown>).reason;
  const reasonLabel =
    typeof rawReason === 'object' && rawReason !== null && 'label' in rawReason
      ? String((rawReason as { label: unknown }).label)
      : typeof rawReason === 'string'
      ? rawReason
      : 'Unspecified';
  const createdDate = new Date(r.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    id: r.id,
    targetType,
    target,
    reason: reasonLabel,
    reasonLabel,
    statement: r.details || '',
    status: statusMap[r.status] || 'open',
    reporter: {
      name: r.reporterUserId || 'Unknown Reporter',
      accountType: 'user',
    },
    createdAt: r.createdAt,
    createdDate,
    timestamp: new Date(r.createdAt).getTime(),
    resolvedAt: r.resolvedAt ? new Date(r.resolvedAt).toLocaleDateString() : undefined,
    resolutionNote: undefined,
  };
}

export async function getAdminReports(params: AdminReportsQueryParams): Promise<{
  items: AdminReport[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const queryParams: Record<string, string | number | boolean | null | undefined> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };
  if (params.status && params.status !== 'all') queryParams.status = params.status;
  if (params.targetType && params.targetType !== 'all') queryParams.targetType = params.targetType;

  const res = await apiClient.get<RawReportRow[]>('/admin/moderation/reports', { params: queryParams });
  const rawList = res.data || [];
  return {
    items: rawList.map(normalizeReport),
    pagination: (res.pagination as { page: number; limit: number; total: number; totalPages: number }) || {
      page: Number(queryParams.page) || 1,
      limit: Number(queryParams.limit) || 20,
      total: rawList.length,
      totalPages: 1,
    },
  };
}

export async function getAdminReport(id: string): Promise<AdminReport | undefined> {
  const res = await apiClient.get<RawReportRow>(`/admin/moderation/reports/${id}`);
  if (!res.data?.report) return undefined;
  return normalizeReport(res.data);
}

export function resolveReport(id: string, notes?: string) {
  return apiClient.patch(`/admin/moderation/reports/${id}`, { status: 'resolved', resolutionNote: notes });
}

export function dismissReport(id: string, notes?: string) {
  return apiClient.patch(`/admin/moderation/reports/${id}`, { status: 'dismissed', resolutionNote: notes });
}

interface RawReportReason {
  id: string;
  label: string;
  description: string | null;
  isActive: boolean;
  appliesTo: AdminReportTargetType[];
  createdAt: string;
}

function normalizeReportReason(r: RawReportReason): AdminReportReasonItem {
  return {
    id: r.id,
    label: r.label,
    description: r.description ?? undefined,
    appliesTo: r.appliesTo,
    isActive: r.isActive,
    createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : undefined,
  };
}

export async function getAdminReportReasons(): Promise<AdminReportReasonItem[]> {
  const res = await apiClient.get<RawReportReason[]>('/admin/report-reasons');
  return (res.data || []).map(normalizeReportReason);
}

export async function createAdminReportReason(data: {
  label: string;
  description?: string;
  appliesTo: AdminReportTargetType[];
}): Promise<AdminReportReasonItem> {
  const res = await apiClient.post<{ reason: RawReportReason }>('/admin/report-reasons', data);
  return normalizeReportReason(res.data!.reason);
}

export async function updateAdminReportReason(
  id: string,
  data: { label?: string; description?: string; isActive?: boolean; appliesTo?: AdminReportTargetType[] }
): Promise<AdminReportReasonItem> {
  const res = await apiClient.patch<{ reason: RawReportReason }>(`/admin/report-reasons/${id}`, data);
  return normalizeReportReason(res.data!.reason);
}

export function deleteAdminReportReason(id: string) {
  return apiClient.delete(`/admin/report-reasons/${id}`);
}
