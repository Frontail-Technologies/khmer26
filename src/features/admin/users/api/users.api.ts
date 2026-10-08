import { apiClient } from '@/lib/api/client';
import type {
  AdminUserListItem,
  AdminUserDetail,
  AdminAccountType,
  AdminAccountStatus,
  AdminVerificationState,
} from '../types';

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  status?: string;
  role?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export function normalizeUserListItem(u: Record<string, unknown>): AdminUserListItem {
  if (u.name && u.accountType && u.verificationStatus && u.joinedAt) {
    return u as unknown as AdminUserListItem;
  }

  const status: AdminAccountStatus =
    u.status === 'banned' || u.status === 'suspended'
      ? 'suspended'
      : u.status === 'restricted'
      ? 'restricted'
      : u.status === 'pending'
      ? 'pending'
      : 'active';
  const sellerProfile = u.sellerProfile as Record<string, unknown> | undefined;
  const province = u.province as Record<string, unknown> | string | undefined;
  const provinceName = typeof province === 'object' ? (province?.nameEn as string) : typeof province === 'string' ? province : '';

  const verification = u.verification as Record<string, unknown> | undefined;
  const verificationStatus: AdminVerificationState =
    verification?.status === 'approved'
      ? 'verified'
      : verification?.status === 'pending' || verification?.status === 'in_review'
      ? 'pending'
      : u.isVerified
      ? 'verified'
      : 'unverified';

  const accountType: AdminAccountType = (sellerProfile?.sellerType || u.sellerType)
    ? ((sellerProfile?.sellerType || u.sellerType) as AdminAccountType)
    : u.role === 'admin'
    ? 'business'
    : 'buyer';

  return {
    id: String(u.id),
    name: (u.fullName || u.username || (typeof u.email === 'string' ? u.email.split('@')[0] : 'User')) as string,
    email: (u.email as string) || '—',
    phone: (u.phoneNumber || u.phone || '—') as string,
    avatarUrl: u.avatarUrl as string | undefined,
    role: (u.role as 'user' | 'admin') || 'user',
    accountType,
    businessName: (sellerProfile?.shopName || u.shopName) as string | undefined,
    location: provinceName || '',
    province: provinceName || '',
    listingsCount: Number(
      u.listingCount ??
      u.listingsCount ??
      u.activeListingsCount ??
      (u.listingStats as Record<string, unknown> | undefined)?.total ??
      0
    ),
    joinedAt: u.createdAt
      ? new Date(u.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    verificationStatus,
    status,
    reportsCount: Number(u.reportCount ?? u.reportsCount ?? 0),
    lastActiveAt: u.lastActiveAt
      ? new Date(u.lastActiveAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : undefined,
    rating: Number(u.rating || 0),
    reviewsCount: Number(u.reviewsCount || 0),
  };
}

export function normalizeUserDetail(u: Record<string, unknown>): AdminUserDetail {
  if (
    u.name &&
    u.accountType &&
    u.verificationStatus &&
    Array.isArray(u.recentListings) &&
    Array.isArray(u.accountHistory)
  ) {
    return u as unknown as AdminUserDetail;
  }

  const base = normalizeUserListItem(u);
  const rawListings = (u.recentListings || u.listings || []) as Array<Record<string, unknown>>;
  const recentListings = rawListings.map((l) => {
    const cat = l.category as Record<string, unknown> | string | undefined;
    const catName = typeof cat === 'object' ? (cat?.nameEn as string) : typeof cat === 'string' ? cat : 'General';
    return {
      id: String(l.id),
      title: (l.title as string) || 'Listing',
      category: catName,
      price: Number(l.price) || 0,
      currency: (l.currency as string) || 'USD',
      status: (l.status as string) || 'active',
      createdAt: l.createdAt ? new Date(l.createdAt as string).toLocaleDateString() : 'Recently',
    };
  });

  const rawHistory = (u.accountHistory || u.history || u.activityLogs || []) as Array<Record<string, unknown>>;
  const rawReviews = (u.recentReviews || u.reviews || []) as Array<Record<string, unknown>>;
  const rawReports = (u.relatedReports || u.reports || []) as Array<Record<string, unknown>>;
  const rawVerif = u.verification as Record<string, unknown> | undefined;
  const rawSub = u.subscription as Record<string, unknown> | undefined;

  return {
    ...base,
    nationalIdMasked: u.nationalIdMasked as string | undefined,
    registeredBusinessNumber: u.registeredBusinessNumber as string | undefined,
    bio: (u.bio || (u.sellerProfile as Record<string, unknown> | undefined)?.bio) as string | undefined,
    address: u.address as string | undefined,
    activeListingsCount: Number(u.activeListingsCount ?? base.listingsCount),
    soldListingsCount: Number(u.soldListingsCount || 0),
    totalSalesVolume: (u.totalSalesVolume as string) || undefined,
    verifiedAt: rawVerif?.reviewedAt
      ? new Date(rawVerif.reviewedAt as string).toLocaleDateString()
      : u.verifiedAt
      ? new Date(u.verifiedAt as string).toLocaleDateString()
      : undefined,
    verification: rawVerif
      ? {
          id: String(rawVerif.id),
          status: String(rawVerif.status),
          type: String(rawVerif.type || 'individual'),
          legalName: rawVerif.legalName as string | null,
          rejectionReason: rawVerif.rejectionReason as string | null,
          reviewedAt: rawVerif.reviewedAt ? String(rawVerif.reviewedAt) : null,
          createdAt: String(rawVerif.createdAt),
        }
      : null,
    subscription: rawSub
      ? {
          id: String(rawSub.id),
          status: String(rawSub.status),
          planName: String(rawSub.planName || 'Pro Plan'),
          planSlug: String(rawSub.planSlug || 'pro'),
          startedAt: String(rawSub.startedAt),
          expiresAt: rawSub.expiresAt ? String(rawSub.expiresAt) : null,
        }
      : null,
    assignedModerator: u.assignedModerator as string | undefined,
    restrictionReason: u.restrictionReason as string | undefined,
    accountHistory: rawHistory.map((h) => ({
      id: String(h.id || Math.random()),
      action: (h.action as string) || 'Account Updated',
      actor: (h.actor as string) || 'System',
      timestamp: (h.timestamp || h.createdAt ? new Date((h.timestamp || h.createdAt) as string).toLocaleDateString() : '—') as string,
      note: (h.note || h.reason) as string | undefined,
    })),
    recentListings,
    recentReviews: rawReviews.map((r) => {
      const reviewer = r.reviewer as Record<string, unknown> | undefined;
      return {
        id: String(r.id || Math.random()),
        authorName: (r.authorName || (typeof reviewer?.email === 'string' ? reviewer.email.split('@')[0] : 'Customer')) as string,
        rating: Number(r.rating || 5),
        comment: (r.comment as string) || '',
        createdAt: r.createdAt ? new Date(r.createdAt as string).toLocaleDateString() : '—',
      };
    }),
    relatedReports: rawReports.map((r) => ({
      id: String(r.id || Math.random()),
      reason: (r.reason as string) || 'Report',
      status: (r.status as string) || 'pending',
      createdAt: r.createdAt ? new Date(r.createdAt as string).toLocaleDateString() : '—',
      reporterName: String(r.reporterName || (r as Record<string, unknown>).reporter_name || 'User'),
    })),
  };
}

export async function getAdminUsers(params: AdminUsersQueryParams): Promise<{
  items: AdminUserListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const queryParams: Record<string, string | number | boolean | null | undefined> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };
  if (params.search || params.q) queryParams.q = params.search || params.q;
  if (params.status && params.status !== 'all') {
    queryParams.status = params.status === 'suspended' ? 'banned' : params.status;
  }
  if (params.role && params.role !== 'all') queryParams.role = params.role;

  const res = await apiClient.get<Record<string, unknown>[]>('/admin/users', { params: queryParams });
  const rawList = res.data || [];
  return {
    items: rawList.map(normalizeUserListItem),
    pagination: (res.pagination as { page: number; limit: number; total: number; totalPages: number }) || {
      page: Number(queryParams.page) || 1,
      limit: Number(queryParams.limit) || 20,
      total: rawList.length,
      totalPages: 1,
    },
  };
}

export async function getAdminUser(id: string): Promise<AdminUserDetail | undefined> {
  const res = await apiClient.get<{ user: Record<string, unknown> }>(`/admin/users/${id}`);
  if (!res.data?.user) return undefined;
  return normalizeUserDetail(res.data.user);
}

export function updateUserStatus(id: string, status: 'active' | 'banned', reason?: string) {
  return apiClient.patch(`/admin/users/${id}/status`, { status, reason });
}

export async function updateAdminUser(
  id: string,
  data: Partial<{
    email: string | null;
    role: 'user' | 'admin';
    businessName: string;
    shopName: string;
    bio: string | null;
    sellerType: 'individual' | 'business' | 'dealer';
  }>
): Promise<AdminUserDetail | undefined> {
  const payload = {
    ...data,
    shopName: data.shopName || data.businessName,
  };
  const res = await apiClient.patch<{ user: Record<string, unknown> }>(`/admin/users/${id}`, payload);
  if (!res.data?.user) return undefined;
  return normalizeUserDetail(res.data.user);
}

export function deleteAdminUser(id: string) {
  return apiClient.delete(`/admin/users/${id}`);
}

export function resetAdminUserPassword(id: string) {
  return apiClient.post(`/admin/users/${id}/reset-password`, {});
}
