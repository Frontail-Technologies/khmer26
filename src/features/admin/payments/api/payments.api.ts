import { apiClient } from '@/lib/api/client';
import type { AdminPaymentTransaction, PaymentStatus, PaymentPurpose } from '../types';

export interface BackendPaymentDto {
  id: string;
  referenceCode: string;
  user: { id: string; email: string | null };
  purpose: string;
  relatedName: string | null;
  relatedListingTitle: string | null;
  amount: number | string;
  currency: string;
  provider: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

export function normalizePayment(p: BackendPaymentDto): AdminPaymentTransaction {
  const statusMap: Record<string, PaymentStatus> = {
    completed: 'successful',
    successful: 'successful',
    failed: 'failed',
    pending: 'pending',
    refunded: 'failed',
  };

  return {
    id: p.id,
    transactionReference: p.referenceCode || p.id.slice(0, 8).toUpperCase(),
    payerId: p.user?.id || '',
    payerName: p.user?.email ? p.user.email.split('@')[0] : 'Customer',
    payerPhone: '—',
    payerEmail: p.user?.email || '—',
    amount: Number(p.amount) || 0,
    currency: p.currency || 'USD',
    purpose: (p.purpose === 'subscription' ? 'subscription' : 'promotion') as PaymentPurpose,
    purposeTitle:
      p.relatedName ||
      p.relatedListingTitle ||
      (p.purpose === 'subscription' ? 'Subscription Plan' : 'Promotion Boost'),
    paymentMethod: 'ABA KHQR',
    status: statusMap[p.status] || 'pending',
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    paidAt: p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
    notes: `Provider: ${p.provider || 'Bakong KHQR'}`,
  };
}

export async function getAdminPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  purpose?: string;
}): Promise<{ items: AdminPaymentTransaction[]; total: number }> {
  const res = await apiClient.get<BackendPaymentDto[]>('/admin/payments', { params });
  const raw = res.data || [];
  return {
    items: raw.map(normalizePayment),
    total: res.pagination?.total || raw.length,
  };
}

export async function getAdminPaymentDetail(id: string): Promise<AdminPaymentTransaction | null> {
  const res = await apiClient.get<{ payment: BackendPaymentDto }>(`/admin/payments/${id}`);
  if (!res.data?.payment) return null;
  return normalizePayment(res.data.payment);
}
