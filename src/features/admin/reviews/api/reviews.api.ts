import { apiClient } from '@/lib/api/client';
import type { AdminReview, AdminReviewStatus } from '../types';
import { formatAdminDateTime } from '@/lib/formatters/date';

export interface BackendReviewDto {
  id: string;
  displayId: string;
  rating: number;
  comment: string | null;
  visibility: string;
  createdAt: string;
  reviewer: { id: string; email: string | null };
  seller: { id: string; shopName: string | null };
}

export function normalizeReview(r: BackendReviewDto): AdminReview {
  return {
    id: r.id,
    displayId: r.displayId,
    rating: r.rating,
    comment: r.comment || '',
    createdAt: r.createdAt ? formatAdminDateTime(r.createdAt) : '—',
    status: (r.visibility === 'hidden' ? 'hidden' : 'visible') as AdminReviewStatus,
    reportsCount: 0,
    reviewer: {
      id: r.reviewer?.id || '',
      name: r.reviewer?.email ? r.reviewer.email.split('@')[0] : 'User',
      email: r.reviewer?.email || undefined,
    },
    seller: {
      id: r.seller?.id || '',
      name: r.seller?.shopName || 'Seller',
    },
  };
}

export async function getAdminReviews(params?: {
  page?: number;
  limit?: number;
  visibility?: string;
}): Promise<{ items: AdminReview[]; total: number }> {
  const res = await apiClient.get<BackendReviewDto[]>('/admin/reviews', { params });
  const raw = res.data || [];
  return {
    items: raw.map(normalizeReview),
    total: res.pagination?.total || raw.length,
  };
}

export async function updateAdminReviewStatus(id: string, visibility: 'visible' | 'hidden') {
  return apiClient.patch(`/admin/reviews/${id}/status`, { visibility });
}
