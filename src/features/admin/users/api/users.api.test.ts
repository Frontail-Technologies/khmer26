import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  normalizeUserDetail,
  normalizeUserListItem,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from './users.api';

function mockApiFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockImplementation(async (url: string | URL) => {
    const urlStr = String(url);
    if (urlStr.includes('/auth/csrf')) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { csrfToken: 'test-csrf' } }),
      };
    }
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => 'application/json' },
      json: async () => body,
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('users.api regression and DTO normalization', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('normalizes full enriched user detail with role, verification, subscription, listings, and logs', () => {
    const rawBackendUser = {
      id: 'usr-100',
      email: 'test@example.com',
      phoneNumber: '+85512345678',
      role: 'admin',
      status: 'active',
      isPhoneVerified: true,
      isEmailVerified: true,
      lastLoginAt: '2026-10-01T10:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      shopName: 'Elite Motors',
      sellerType: 'dealer',
      bio: 'Verified auto dealership in Phnom Penh',
      address: 'Preah Monivong Blvd',
      businessRegistrationNumber: 'BR-9999',
      verifiedAt: '2026-02-01T00:00:00.000Z',
      ratingAvg: '4.85',
      ratingCount: 42,
      responseRate: '98%',
      responseTime: '< 15 mins',
      listingStats: {
        total: 25,
        active: 18,
        sold: 7,
      },
      verification: {
        id: 'ver-1',
        type: 'business',
        status: 'approved',
        legalName: 'Elite Motors Co., Ltd.',
        submittedAt: '2026-01-15T00:00:00.000Z',
        reviewedAt: '2026-01-16T00:00:00.000Z',
        rejectionReason: null,
      },
      subscription: {
        id: 'sub-1',
        planId: 'plan-pro',
        planName: 'Pro Dealer Monthly',
        status: 'active',
        startedAt: '2026-02-01T00:00:00.000Z',
        expiresAt: '2026-11-01T00:00:00.000Z',
      },
      recentListings: [
        {
          id: 'lst-1',
          title: '2023 Toyota Camry Hybrid',
          price: 36500,
          currency: 'USD',
          status: 'active',
          createdAt: '2026-09-20T00:00:00.000Z',
          categoryName: 'Cars',
        },
      ],
      reports: [
        {
          id: 'rep-1',
          reason: 'Inquiry response delayed',
          status: 'resolved',
          createdAt: '2026-08-10T00:00:00.000Z',
        },
      ],
      activityLogs: [
        {
          id: 'act-1',
          action: 'user.login',
          createdAt: '2026-10-01T10:00:00.000Z',
          details: 'IP: 127.0.0.1',
        },
      ],
    };

    const normalized = normalizeUserDetail(rawBackendUser);

    expect(normalized.id).toBe('usr-100');
    expect(normalized.email).toBe('test@example.com');
    expect(normalized.role).toBe('admin');
    expect(normalized.businessName).toBe('Elite Motors');
    expect(normalized.accountType).toBe('dealer');
    expect(normalized.verification?.status).toBe('approved');
    expect(normalized.verification?.legalName).toBe('Elite Motors Co., Ltd.');
    expect(normalized.subscription?.planName).toBe('Pro Dealer Monthly');
    expect(normalized.listingsCount).toBe(25);
    expect(normalized.recentListings).toHaveLength(1);
    expect(normalized.recentListings[0]!.title).toBe('2023 Toyota Camry Hybrid');
    expect(normalized.accountHistory).toHaveLength(1);
    expect(normalized.relatedReports).toHaveLength(1);
  });

  it('normalizes list item with role and verification info', () => {
    const rawListItem = {
      id: 'usr-2',
      email: 'member@test.com',
      phoneNumber: '+85588888888',
      role: 'user',
      status: 'suspended',
      isPhoneVerified: false,
      isEmailVerified: true,
      lastLoginAt: null,
      createdAt: '2026-05-01T00:00:00.000Z',
      shopName: null,
      sellerType: 'individual',
      totalListings: 3,
      verification: {
        status: 'pending',
      },
    };

    const item = normalizeUserListItem(rawListItem);
    expect(item.id).toBe('usr-2');
    expect(item.role).toBe('user');
    expect(item.status).toBe('suspended');
    expect(item.verificationStatus).toBe('pending');
    expect(item.accountType).toBe('individual');
  });

  it('calls PATCH /admin/users/:id with updated profile and role fields', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { user: { id: 'usr-10' } } });

    await updateAdminUser('usr-10', {
      role: 'admin',
      shopName: 'Updated Motors',
      sellerType: 'dealer',
      bio: 'New bio',
    });

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/users/usr-10');
    expect(targetCall[1]?.method).toBe('PATCH');

    const sentBody = JSON.parse(targetCall[1]?.body as string);
    expect(sentBody.role).toBe('admin');
    expect(sentBody.shopName).toBe('Updated Motors');
    expect(sentBody.sellerType).toBe('dealer');
    expect(sentBody.bio).toBe('New bio');
  });

  it('calls DELETE /admin/users/:id for soft-delete', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { message: 'User soft-deleted' } });

    await deleteAdminUser('usr-10');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/users/usr-10');
    expect(targetCall[1]?.method).toBe('DELETE');
  });

  it('fetches user detail from GET /admin/users/:id and unwraps user envelope', async () => {
    const fetchMock = mockApiFetch({
      success: true,
      data: {
        user: {
          id: 'usr-99',
          email: 'agent@khmer26.com',
          role: 'admin',
          status: 'active',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    const user = await getAdminUser('usr-99');
    expect(user?.id).toBe('usr-99');
    expect(user?.role).toBe('admin');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/users/usr-99');
    expect(targetCall[1]?.method).toBe('GET');
  });
});
