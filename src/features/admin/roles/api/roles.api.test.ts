import { describe, expect, it, vi, beforeEach } from 'vitest';
import { assignStaffRole, removeStaffRole } from './roles.api';

function mockFetchOnce(body: unknown = { success: true, data: {} }) {
  const fetchMock = vi.fn().mockImplementation(async (url: string | URL) => {
    const urlStr = String(url);
    if (urlStr.includes('/auth/csrf')) {
      return {
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { csrfToken: 'test-csrf' } }),
      };
    }
    return {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => body,
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('RBAC staff role assignment contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('assigns a role via POST /admin/staff/:userId/roles with { roleId } body, not /admin/roles/staff', async () => {
    const fetchMock = mockFetchOnce();
    await assignStaffRole('user-1', 'role-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [url, config] = targetCall;
    expect(String(url)).toContain('/admin/staff/user-1/roles');
    expect(String(url)).not.toContain('/admin/roles/staff');
    expect(config?.method).toBe('POST');
    expect(JSON.parse(String(config?.body))).toEqual({ roleId: 'role-1' });
  });

  it('removes a role via DELETE /admin/staff/:userId/roles/:roleId', async () => {
    const fetchMock = mockFetchOnce();
    await removeStaffRole('user-1', 'role-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [url, config] = targetCall;
    expect(String(url)).toContain('/admin/staff/user-1/roles/role-1');
    expect(config?.method).toBe('DELETE');
  });
});
