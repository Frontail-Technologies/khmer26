import { apiClient } from '@/lib/api/client';

export interface AdminDashboardData {
  users?: {
    total: number;
    active: number;
    suspended: number;
    newToday: number;
    newLast7Days: number;
  };
  sellers?: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  listings?: {
    total: number;
    active: number;
    pendingReview: number;
    rejected: number;
    sold: number;
    expired: number;
    flagged: number;
  };
  subscriptions?: {
    active: number;
    expiringSoon: number;
    planDistribution: Array<{
      planId: string;
      planName: string;
      count: number;
    }>;
  };
  revenue?: {
    today: number;
    last7Days: number;
    last30Days: number;
    subscriptionRevenueLast30Days: number;
    promotionRevenueLast30Days: number;
  };
  reports?: {
    open: number;
    resolved: number;
    dismissed: number;
  };
  chat?: {
    conversationsCreatedToday: number;
    messagesToday: number;
    offersPending: number;
    offersAccepted: number;
  };
  topCategories?: Array<{
    categoryId: string;
    nameEn: string;
    activeListings: number;
  }>;
  recentListings?: Array<{
    id: string;
    title: string;
    price: string | null;
    currency: 'USD' | 'KHR' | null;
    status: 'active' | 'sold' | 'expired';
    moderationStatus: 'pending_review' | 'approved' | 'rejected';
    createdAt: string;
    sellerId: string;
    sellerEmail: string | null;
    categoryName: string;
  }>;
  topSellers?: Array<{
    sellerId: string;
    profileId: string;
    name: string;
    sellerType: 'individual' | 'business' | 'dealer';
    activeListings: number;
  }>;
  moderationQueue?: Array<{
    id: string;
    type: 'listing' | 'verification' | 'report';
    title: string;
    subtitle: string;
    priority: 'normal' | 'high' | 'urgent';
    submittedAt: string;
    href: string;
  }>;
  recentActivity?: Array<{
    id: string;
    action: string;
    targetType: string;
    targetId: string | null;
    details: string | null;
    createdAt: string;
    actorEmail: string | null;
  }>;
  recentOpenReports?: Array<{
    report: {
      id: string;
      reporterUserId: string | null;
      targetType: string;
      listingId: string | null;
      userId: string | null;
      sellerProfileId: string | null;
      conversationId: string | null;
      details: string | null;
      status: string;
      createdAt: string;
    };
    reason: { id: string; label: string } | null;
  }>;
  recentOpenChatReports?: Array<{
    report: {
      id: string;
      reporterUserId: string | null;
      conversationId: string | null;
      details: string | null;
      status: string;
      createdAt: string;
    };
    reason: { id: string; label: string } | null;
  }>;
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const res = await apiClient.get<AdminDashboardData>('/admin/dashboard');
  return res.data || {};
}
