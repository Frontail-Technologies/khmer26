import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  updateAdminListing,
  deleteListing,
  restoreListing,
  approveListing,
  rejectListing,
} from './listings.api';

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

describe('listings.api admin CRUD mutations', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('updates listing fields via PATCH /admin/listings/:id', async () => {
    const fetchMock = mockApiFetch({
      success: true,
      data: {
        listing: {
          id: 'lst-1',
          title: 'Updated iPhone 15 Pro',
          price: 950,
          currency: 'USD',
          description: 'Excellent condition with original box',
          status: 'active',
          images: [],
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    const result = await updateAdminListing('lst-1', {
      title: 'Updated iPhone 15 Pro',
      price: 950,
      currency: 'USD',
      description: 'Excellent condition with original box',
    });

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/listings/lst-1');
    expect(targetCall[1]?.method).toBe('PATCH');

    const sentBody = JSON.parse(targetCall[1]?.body as string);
    expect(sentBody.title).toBe('Updated iPhone 15 Pro');
    expect(sentBody.price).toBe(950);
    expect(result?.id).toBe('lst-1');
  });

  it('deletes listing via DELETE /admin/listings/:id', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { message: 'Listing deleted' } });

    await deleteListing('lst-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/listings/lst-1');
    expect(targetCall[1]?.method).toBe('DELETE');
  });

  it('restores listing via POST /admin/listings/:id/restore', async () => {
    const fetchMock = mockApiFetch({
      success: true,
      data: { message: 'Listing restored' },
    });

    await restoreListing('lst-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/listings/lst-1/restore');
    expect(targetCall[1]?.method).toBe('POST');
  });

  it('approves listing via POST /admin/listings/:id/approve', async () => {
    const fetchMock = mockApiFetch({
      success: true,
      data: { message: 'Listing approved' },
    });

    await approveListing('lst-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/listings/lst-1/approve');
    expect(targetCall[1]?.method).toBe('POST');
  });

  it('rejects listing with reason via POST /admin/listings/:id/reject', async () => {
    const fetchMock = mockApiFetch({
      success: true,
      data: { message: 'Listing rejected' },
    });

    await rejectListing('lst-1', 'Prohibited item guidelines violation');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/listings/lst-1/reject');
    expect(targetCall[1]?.method).toBe('POST');

    const sentBody = JSON.parse(targetCall[1]?.body as string);
    expect(sentBody.reason).toBe('Prohibited item guidelines violation');
  });
});
