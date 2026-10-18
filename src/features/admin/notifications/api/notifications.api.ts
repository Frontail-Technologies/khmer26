import { apiClient } from '@/lib/api/client';
import type { NotificationRecord, NotificationAudience } from '../types';
import { formatAdminDateTime } from '@/lib/formatters/date';

export interface BackendBroadcastDto {
  id: string;
  displayId: string;
  title: string;
  titleKm?: string | null;
  body: string;
  bodyKm?: string | null;
  audience: string;
  specificUserId: string | null;
  sentByUserId: string | null;
  createdAt: string;
  deliveredCount?: number;
}

export function normalizeBroadcast(b: BackendBroadcastDto): NotificationRecord {
  return {
    id: b.id,
    displayId: b.displayId,
    title: b.title,
    titleKm: b.titleKm ?? null,
    message: b.body,
    messageKm: b.bodyKm ?? null,
    audience: (b.audience || 'all_users') as NotificationAudience,
    targetUser: b.specificUserId || undefined,
    sentAt: b.createdAt
      ? formatAdminDateTime(b.createdAt)
      : '—',
    status: 'sent',
    sentBy: 'System Administrator',
  };
}

export async function getAdminBroadcasts(params?: {
  page?: number;
  limit?: number;
  audience?: string;
}): Promise<{ items: NotificationRecord[]; total: number }> {
  const res = await apiClient.get<BackendBroadcastDto[]>('/admin/notifications/broadcasts', { params });
  const raw = res.data || [];
  return {
    items: raw.map(normalizeBroadcast),
    total: res.pagination?.total || raw.length,
  };
}

export async function createAdminBroadcast(data: {
  title: string;
  titleKm?: string | null;
  body: string;
  bodyKm?: string | null;
  audience: 'all_users' | 'buyers' | 'sellers' | 'dealers' | 'specific_user';
  specificUserId?: string | null;
}) {
  return apiClient.post('/admin/notifications/broadcasts', data);
}

export async function updateAdminBroadcast(id: string, data: { title?: string; titleKm?: string | null; body?: string; bodyKm?: string | null }) {
  return apiClient.patch(`/admin/notifications/broadcasts/${id}`, data);
}

export async function deleteAdminBroadcast(id: string) {
  return apiClient.delete(`/admin/notifications/broadcasts/${id}`);
}
