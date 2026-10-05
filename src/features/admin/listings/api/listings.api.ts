import { apiClient } from '@/lib/api/client';
import { formatAdminDate } from '@/lib/formatters/date';
import type {
  AdminListing,
  AdminListingStatus,
  AdminSellerType,
  AdminListingImage,
  AdminListingSpecification,
  AdminListingReport,
  AdminListingAuditEvent,
} from '../types';

export interface AdminListingsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  moderationStatus?: string;
  status?: string;
  listingStatus?: string;
  sort?: string;
  order?: string;
  categoryId?: string;
  sellerId?: string;
  reportedOnly?: boolean;
  featuredOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  provinceId?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export function normalizeListing(raw: Record<string, unknown>): AdminListing {
  if (
    raw &&
    typeof raw === 'object' &&
    typeof raw.title === 'string' &&
    typeof raw.price === 'number' &&
    raw.seller &&
    typeof (raw.seller as Record<string, unknown>).name === 'string' &&
    raw.location &&
    typeof (raw.location as Record<string, unknown>).province === 'string' &&
    Array.isArray(raw.images) &&
    Array.isArray(raw.specifications) &&
    Array.isArray(raw.reports) &&
    Array.isArray(raw.history)
  ) {
    return raw as unknown as AdminListing;
  }

  const listing = (raw.listing as Record<string, unknown> | undefined) ?? raw;
  const rawCat = (raw.category as Record<string, unknown> | undefined) ?? (listing.category as Record<string, unknown> | undefined);
  const rawSeller = (raw.seller as Record<string, unknown> | undefined) ?? (listing.seller as Record<string, unknown> | undefined);
  const rawProvince = (raw.province as Record<string, unknown> | undefined) ?? (listing.province as Record<string, unknown> | undefined);
  const statusMapping: Record<string, AdminListingStatus> = {
    pending_review: 'pending',
    pending: 'pending',
    approved: 'active',
    active: 'active',
    rejected: 'rejected',
    sold: 'sold',
    expired: 'expired',
    removed: 'removed',
  };

  const status: AdminListingStatus =
    listing.isFlagged === true
      ? 'flagged'
      : listing.moderationStatus === 'pending_review'
      ? 'pending'
      : listing.moderationStatus === 'rejected'
      ? 'rejected'
      : statusMapping[listing.status as string] || 'active';

  const rawMedia = (listing.media || listing.images || []) as Array<Record<string, unknown>>;
  const images: AdminListingImage[] = rawMedia.map((m) => ({
    id: String(m.id || Math.random()),
    url: (m.url || m.fileUrl || '/placeholder.png') as string,
    alt: listing.title as string,
    isPrimary: Boolean(m.isCover || m.isPrimary),
  }));

  const seller = {
    id: (rawSeller?.id || listing.sellerId || listing.userId || '') as string,
    name: (rawSeller?.shopName || rawSeller?.fullName || rawSeller?.name || (typeof rawSeller?.email === 'string' ? rawSeller.email.split('@')[0] : 'Seller')) as string,
    username: rawSeller?.username as string | undefined,
    avatar: (rawSeller?.avatarUrl || rawSeller?.avatar) as string | undefined,
    sellerType: ((rawSeller?.sellerType as string) || 'individual') as AdminSellerType,
    verified: Boolean(rawSeller?.isVerified),
    phone: (rawSeller?.phone || rawSeller?.phoneNumber) as string | undefined,
    email: rawSeller?.email as string | undefined,
    joinedDate: rawSeller?.createdAt ? formatAdminDate(rawSeller.createdAt as string) : '—',
    activeListings: Number(rawSeller?.activeListingsCount || 1),
    rating: Number(rawSeller?.rating || 5),
    slug: rawSeller?.slug as string | undefined,
  };

  const rawLoc = listing.location as Record<string, unknown> | undefined;
  const rawDist = listing.district as Record<string, unknown> | undefined;

  const location = {
    province: (rawLoc?.provinceName || rawProvince?.nameEn || rawLoc?.province || 'Phnom Penh') as string,
    district: (rawLoc?.districtName || rawDist?.nameEn || rawLoc?.district) as string | undefined,
    address: rawLoc?.address as string | undefined,
  };

  const rawSpecs = (listing.attributes || listing.specifications || []) as Array<Record<string, unknown>>;
  const specifications: AdminListingSpecification[] = rawSpecs.map((a) => ({
    label: (a.label || a.fieldLabel || a.name || 'Specification') as string,
    value: String(a.value || a.fieldValue || '—'),
    group: a.group as string | undefined,
  }));

  const rawReports = (listing.reports || raw.reports || []) as Array<Record<string, unknown>>;
  const reports: AdminListingReport[] = rawReports.map((r) => ({
    id: String(r.id),
    reason: (r.reason as string) || 'Reported content',
    reporterType: 'user' as const,
    submittedAt: r.createdAt ? formatAdminDate(r.createdAt as string) : '—',
    status: ((r.status as string) || 'pending') as 'pending' | 'reviewed' | 'dismissed',
  }));

  const rawHistory = (listing.auditLogs || listing.history || raw.auditLogs || raw.history || []) as Array<Record<string, unknown>>;
  const history: AdminListingAuditEvent[] = rawHistory.map((h) => {
    const actorObj = h.actor as Record<string, unknown> | undefined;
    return {
      id: String(h.id),
      action: (h.action as string) || 'Moderation',
      actor: (actorObj?.email || h.actorName || 'Moderator') as string,
      actorRole: 'Admin',
      timestamp: h.createdAt ? formatAdminDate(h.createdAt as string) : '—',
      reason: h.reason as string | undefined,
    };
  });

  const createdDate = listing.createdAt ? formatAdminDate(listing.createdAt as string) : '—';

  return {
    id: String(listing.id),
    slug: listing.slug as string | undefined,
    title: (listing.title as string) || 'Listing',
    price: Number(listing.price) || 0,
    currency: (listing.currency as 'USD' | 'KHR') || 'USD',
    negotiable: Boolean(listing.negotiable),
    categoryId: (listing.categoryId || rawCat?.id || '') as string,
    categoryName: (rawCat?.nameEn || listing.categoryName || 'General') as string,
    categoryPath: [(rawCat?.nameEn || raw.categoryName || 'General') as string],
    condition: (raw.condition as string) || 'Used',
    status,
    location,
    seller,
    images: images.length > 0 ? images : [{ id: '1', url: '/placeholder.png', isPrimary: true }],
    description: (listing.description as string) || '',
    specifications,
    reports,
    history,
    viewCount: Number(listing.viewsCount || 0),
    favoriteCount: Number(listing.favoritesCount || 0),
    createdAt: (listing.createdAt as string) || new Date().toISOString(),
    createdDate,
    updatedAt: listing.updatedAt as string | undefined,
    rejectionReason: listing.rejectionReason as string | undefined,
  };
}

export async function getAdminListings(params: AdminListingsQueryParams): Promise<{
  items: AdminListing[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  let sortVal: 'newest' | 'oldest' | 'price_asc' | 'price_desc' = 'newest';
  if (params.sort === 'createdAt' || params.sort === 'newest') {
    sortVal = params.order === 'asc' ? 'oldest' : 'newest';
  } else if (params.sort === 'price') {
    sortVal = params.order === 'asc' ? 'price_asc' : 'price_desc';
  } else if (params.sort && ['newest', 'oldest', 'price_asc', 'price_desc'].includes(params.sort)) {
    sortVal = params.sort as 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  }

  const queryParams: Record<string, string | number | boolean | null | undefined> = {
    page: params.page || 1,
    limit: params.limit || 20,
    sort: sortVal,
  };

  if (params.search || params.q) queryParams.q = params.search || params.q;
  if (params.moderationStatus && params.moderationStatus !== 'all') {
    queryParams.moderationStatus = params.moderationStatus;
  }
  if (params.status && params.status !== 'all') {
    queryParams.listingStatus = params.status;
  }
  if (params.listingStatus) queryParams.listingStatus = params.listingStatus;
  if (params.categoryId) queryParams.categoryId = params.categoryId;
  if (params.sellerId) queryParams.sellerId = params.sellerId;
  if (params.reportedOnly) queryParams.reportedOnly = params.reportedOnly;
  if (params.featuredOnly) queryParams.featuredOnly = params.featuredOnly;
  if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
  if (params.provinceId !== undefined) queryParams.provinceId = params.provinceId;

  const res = await apiClient.get<Record<string, unknown>[]>('/admin/listings', { params: queryParams });
  const rawList = res.data || [];
  return {
    items: rawList.map(normalizeListing),
    pagination: (res.pagination as { page: number; limit: number; total: number; totalPages: number }) || {
      page: Number(queryParams.page) || 1,
      limit: Number(queryParams.limit) || 20,
      total: rawList.length,
      totalPages: 1,
    },
  };
}

export async function getAdminListing(id: string): Promise<AdminListing | undefined> {
  const res = await apiClient.get<{ listing: Record<string, unknown> }>(`/admin/listings/${id}`);
  if (!res.data?.listing) return undefined;
  return normalizeListing(res.data.listing);
}

export function approveListing(id: string) {
  return apiClient.post(`/admin/listings/${id}/approve`);
}

export function rejectListing(id: string, reason: string) {
  return apiClient.post(`/admin/listings/${id}/reject`, { reason });
}

export function suspendListing(id: string, reason: string) {
  return apiClient.post(`/admin/listings/${id}/suspend`, { reason });
}

export function restoreListing(id: string) {
  return apiClient.post(`/admin/listings/${id}/restore`);
}

export function deleteListing(id: string) {
  return apiClient.delete(`/admin/listings/${id}`);
}

export async function updateAdminListing(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number | null;
    currency: 'USD' | 'KHR';
  }>
): Promise<AdminListing | undefined> {
  const res = await apiClient.patch<{ listing: Record<string, unknown> }>(`/admin/listings/${id}`, data);
  if (!res.data?.listing) return undefined;
  return normalizeListing(res.data.listing);
}
