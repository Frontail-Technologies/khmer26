import { apiClient } from '@/lib/api/client';
import type {
  VerificationRequest,
  VerificationStatus,
  VerificationType,
  VerificationSellerType,
  VerificationDocument,
  VerificationDocumentType,
} from '../types';

export interface AdminVerificationsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  q?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export function normalizeVerification(raw: Record<string, unknown>): VerificationRequest {
  const req = (raw.request as Record<string, unknown> | undefined) ?? raw;
  const statusMap: Record<string, VerificationStatus> = {
    pending: 'pending',
    in_review: 'in_review',
    approved: 'approved',
    rejected: 'rejected',
  };

  const rawSellerProfile = raw.sellerProfile as Record<string, unknown> | undefined;
  const rawSeller = (raw.seller as Record<string, unknown> | undefined) ?? rawSellerProfile;
  const userEmail = (raw.userEmail as string | undefined) ?? (rawSeller?.email as string | undefined);

  const seller = {
    id: (rawSeller?.id || req.sellerProfileId || raw.userId || raw.sellerId || '') as string,
    name: (rawSeller?.fullName || rawSeller?.shopName || rawSeller?.name || rawSeller?.username || (userEmail ? userEmail.split('@')[0] : 'Applicant')) as string,
    avatar: rawSeller?.avatarUrl as string | undefined,
    email: userEmail || (rawSeller?.email as string) || '—',
    phone: (rawSeller?.phoneNumber || rawSeller?.phone || '—') as string,
    sellerType: ((rawSeller?.sellerType as string) || 'individual') as VerificationSellerType,
    location: (rawSeller?.province as string) || 'Phnom Penh',
    joinedDate: rawSeller?.createdAt ? new Date(rawSeller.createdAt as string).toLocaleDateString() : '2026',
    activeListings: Number(rawSeller?.activeListingsCount || 0),
    slug: rawSeller?.slug as string | undefined,
  };

  const rawDocuments = (req.documents || raw.documents || []) as Array<Record<string, unknown>>;
  const documents: VerificationDocument[] = rawDocuments.map((d) => ({
    id: String(d.id || Math.random()),
    type: (d.type as VerificationDocumentType) || 'national_id_front',
    title: (d.title || d.fileName || 'Verification Document') as string,
    fileUrl: (d.url || d.fileUrl || '/placeholder.png') as string,
    fileSize: (d.fileSize as string) || '1.2 MB',
    fileType: (d.fileType as string) || 'image/jpeg',
    uploadedAt: d.createdAt ? new Date(d.createdAt as string).toLocaleDateString() : '—',
    status: 'submitted' as const,
  }));

  const rawHistory = (req.history || raw.history || []) as Array<Record<string, unknown>>;
  const submittedAt = (req.createdAt as string) || (raw.createdAt as string) || new Date().toISOString();
  const submittedDate = new Date(submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const rawIdDetails = (req.identityDetails || raw.identityDetails) as Record<string, unknown> | undefined;
  const rawBizDetails = (req.businessDetails || raw.businessDetails) as Record<string, unknown> | undefined;

  return {
    id: String(req.id || raw.id),
    seller,
    type: ((req.verificationType || req.type || raw.type || 'identity') as string) as VerificationType,
    status: statusMap[String(req.status || raw.status)] || 'pending',
    submittedAt,
    submittedDate,
    updatedAt: (req.updatedAt as string) || (raw.updatedAt as string) || submittedAt,
    assignedTo: (req.assignedModerator || raw.assignedModerator) as string | undefined,
    documents: documents.length > 0 ? documents : [
      {
        id: 'doc-1',
        type: 'national_id_front',
        title: 'National ID (Front)',
        fileUrl: '/placeholder.png',
        fileSize: '1.4 MB',
        fileType: 'image/jpeg',
        uploadedAt: submittedDate,
        status: 'submitted',
      },
    ],
    identityDetails: rawIdDetails
      ? {
          fullName: (rawIdDetails.fullName as string) || seller.name,
          idType: (rawIdDetails.idType as string) || 'National ID',
          idNumber: (rawIdDetails.idNumber as string) || 'ID-88291039',
        }
      : {
          fullName: seller.name,
          idType: 'National ID',
          idNumber: 'ID-88291039',
        },
    businessDetails: rawBizDetails
      ? {
          businessName: (rawBizDetails.businessName as string) || '',
          registrationNumber: (rawBizDetails.registrationNumber as string) || '',
          taxNumber: rawBizDetails.taxNumber as string | undefined,
          registeredAddress: (rawBizDetails.registeredAddress as string) || '',
          ownerName: (rawBizDetails.ownerName as string) || seller.name,
          businessCategory: rawBizDetails.businessCategory as string | undefined,
        }
      : undefined,
    history: rawHistory.map((h) => ({
      id: String(h.id || Math.random()),
      action: (h.action as string) || 'Status Update',
      actor: (h.actor as string) || 'Moderator',
      timestamp: h.createdAt ? new Date(h.createdAt as string).toLocaleDateString() : '—',
      note: h.note as string | undefined,
      type: 'status_change',
    })),
    riskScore: 'low',
    rejectionReason: raw.rejectionReason as string | undefined,
  };
}

export async function getAdminVerifications(params: AdminVerificationsQueryParams): Promise<{
  items: VerificationRequest[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const queryParams: Record<string, string | number | boolean | null | undefined> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };
  if (params.status && params.status !== 'all') queryParams.status = params.status;
  if (params.type && params.type !== 'all') queryParams.type = params.type;

  const res = await apiClient.get<Record<string, unknown>[]>('/admin/verifications', { params: queryParams });
  const rawList = res.data || [];
  return {
    items: rawList.map(normalizeVerification),
    pagination: (res.pagination as { page: number; limit: number; total: number; totalPages: number }) || {
      page: Number(queryParams.page) || 1,
      limit: Number(queryParams.limit) || 20,
      total: rawList.length,
      totalPages: 1,
    },
  };
}

export async function getAdminVerification(id: string): Promise<VerificationRequest | undefined> {
  const res = await apiClient.get<{ verification: Record<string, unknown> }>(`/admin/verifications/${id}`);
  if (!res.data?.verification) return undefined;
  return normalizeVerification(res.data.verification);
}

export function approveVerification(id: string) {
  return apiClient.post(`/admin/verifications/${id}/approve`);
}

export function rejectVerification(id: string, reason: string) {
  return apiClient.post(`/admin/verifications/${id}/reject`, { reason });
}
