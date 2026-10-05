import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAdminChatReports, getAdminChatReportContext, updateChatReportStatus } from './chat-reports.api';

function mockFetchOnce(body: unknown = { success: true, data: [] }) {
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

describe('canonical chat-report navigation contract', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists chat reports via the real moderation route, not a fake /admin/chats browsing endpoint', async () => {
    const fetchMock = mockFetchOnce();
    await getAdminChatReports({});

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/moderation/chat-reports');
  });

  it('loads report context via GET /admin/moderation/chat-reports/:id/context', async () => {
    const fetchMock = mockFetchOnce({ success: true, data: { conversation: { participants: [] }, messages: [] } });
    await getAdminChatReportContext('report-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/moderation/chat-reports/report-1/context');
    expect(targetCall[1]?.method).toBe('GET');
  });

  it('updates chat report status via PATCH /admin/moderation/chat-reports/:id', async () => {
    const fetchMock = mockFetchOnce();
    await updateChatReportStatus('report-1', 'resolved', 'handled');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    const [url, config] = targetCall;
    expect(String(url)).toContain('/admin/moderation/chat-reports/report-1');
    expect(config?.method).toBe('PATCH');
    expect(JSON.parse(String(config?.body))).toEqual({ status: 'resolved', resolutionNote: 'handled' });
  });
});
