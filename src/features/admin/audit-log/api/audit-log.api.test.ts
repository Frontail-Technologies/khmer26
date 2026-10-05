import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAdminAuditLogs } from './audit-log.api';

function mockFetchOnce(body: unknown = { success: true, data: [] }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    headers: { get: () => 'application/json' },
    json: async () => body,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('canonical audit log route contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches audit entries from the plural /admin/audit-logs route, not the singular /admin/audit-log', async () => {
    const fetchMock = mockFetchOnce();
    await getAdminAuditLogs();

    const [url] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('/admin/audit-logs');
  });
});
