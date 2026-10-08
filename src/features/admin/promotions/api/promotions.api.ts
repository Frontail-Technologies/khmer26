import { apiClient } from '@/lib/api/client';
import type { ActivePromotionItem, PromotionType } from '../types';

export interface AdminPromotionPackageRow {
  id: string;
  promotionType: 'featured' | 'top_listing' | 'urgent';
  name: string;
  description: string | null;
  durationDays: number;
  price: string | number;
  currency: 'USD' | 'KHR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminPromotionPackages(): Promise<AdminPromotionPackageRow[]> {
  const res = await apiClient.get<AdminPromotionPackageRow[]>('/admin/promotions/packages');
  return res.data || [];
}

export async function createAdminPromotionPackage(data: {
  promotionType: 'featured' | 'top_listing' | 'urgent';
  name: string;
  description?: string | null;
  durationDays: number;
  price: number;
  currency?: 'USD' | 'KHR';
  isActive?: boolean;
}) {
  return apiClient.post('/admin/promotions/packages', data);
}

export async function updateAdminPromotionPackage(
  id: string,
  data: Partial<{
    promotionType: 'featured' | 'top_listing' | 'urgent';
    name: string;
    description: string | null;
    durationDays: number;
    price: number;
    currency: 'USD' | 'KHR';
    isActive: boolean;
  }>
) {
  return apiClient.patch(`/admin/promotions/packages/${id}`, data);
}

export async function activateAdminPromotionPackage(id: string) {
  return apiClient.post(`/admin/promotions/packages/${id}/activate`);
}

export async function deactivateAdminPromotionPackage(id: string) {
  return apiClient.post(`/admin/promotions/packages/${id}/deactivate`);
}

export async function deleteAdminPromotionPackage(id: string) {
  return apiClient.delete(`/admin/promotions/packages/${id}`);
}

interface RawActivePromotionRow {
  promotion: { id: string; listingId: string; startedAt: string; expiresAt: string };
  package: { promotionType: PromotionType; durationDays: number };
  listing: { id: string; title: string; price: string; currency: string; userId: string };
  seller: { id: string; email: string | null };
  sellerProfile: { shopName: string } | null;
  payment: { referenceCode: string; amount: string } | null;
}

function normalizeActivePromotion(row: RawActivePromotionRow): ActivePromotionItem {
  const now = Date.now();
  const expiresAt = new Date(row.promotion.expiresAt).getTime();
  return {
    id: row.promotion.id,
    listingId: row.listing.id,
    listingTitle: row.listing.title,
    listingPrice: Number(row.listing.price),
    currency: row.listing.currency,
    sellerId: row.seller.id,
    sellerName: row.sellerProfile?.shopName || row.seller.email || 'Unknown Seller',
    promotionType: row.package.promotionType,
    durationDays: row.package.durationDays,
    startedAt: new Date(row.promotion.startedAt).toLocaleDateString(),
    expiresAt: new Date(row.promotion.expiresAt).toLocaleDateString(),
    status: expiresAt > now ? 'active' : 'expired',
    paymentReference: row.payment?.referenceCode,
    amountPaid: row.payment ? Number(row.payment.amount) : undefined,
  };
}

export async function getAdminActivePromotions(params: { status?: 'active' | 'expired'; page?: number; limit?: number } = {}): Promise<{
  items: ActivePromotionItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const queryParams: Record<string, string | number | undefined> = {
    page: params.page || 1,
    limit: params.limit || 50,
  };
  if (params.status) queryParams.status = params.status;

  const res = await apiClient.get<RawActivePromotionRow[]>('/admin/promotions/active', { params: queryParams });
  const rawList = res.data || [];
  return {
    items: rawList.map(normalizeActivePromotion),
    pagination: (res.pagination as { page: number; limit: number; total: number; totalPages: number }) || {
      page: Number(queryParams.page) || 1,
      limit: Number(queryParams.limit) || 50,
      total: rawList.length,
      totalPages: 1,
    },
  };
}
