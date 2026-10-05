import { apiClient } from '@/lib/api/client';
import type { NotificationRecord, NotificationAudience } from '../types';

export interface BackendBroadcastDto {
  id: string;
  title: string;
  body: string;
  audience: string;
  specificUserId: string | null;
  sentByUserId: string | null;
  createdAt: string;
  deliveredCount?: number;
}

export function normalizeBroadcast(b: BackendBroadcastDto): NotificationRecord {
  return {
    id: b.id,
    title: b.title,
    message: b.body,
    audience: (b.audience || 'all_users') as NotificationAudience,
    targetUser: b.specificUserId || undefined,
    sentAt: b.createdAt
      ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
  body: string;
  audience: 'all_users' | 'buyers' | 'sellers' | 'dealers' | 'specific_user';
  specificUserId?: string | null;
}) {
  return apiClient.post('/admin/notifications/broadcasts', data);
}
