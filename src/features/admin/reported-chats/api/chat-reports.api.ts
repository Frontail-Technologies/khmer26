import { apiClient } from '@/lib/api/client';
import type { ReportedChatRecord, ReportedChatStatus, ReportedChatMessage } from '../types';

interface RawChatReportRow {
  report: {
    id: string;
    reporterUserId: string | null;
    conversationId: string | null;
    messageId: string | null;
    reasonId: string;
    details: string | null;
    status: string;
    resolvedAt: string | null;
    createdAt: string;
  };
  reason?: { id: string; label: string } | null;
}

export interface ChatReportsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  [key: string]: string | number | undefined;
}

function normalizeChatReport(row: RawChatReportRow): ReportedChatRecord {
  const r = row.report;
  return {
    id: r.id,
    conversationId: r.conversationId || '',
    reportedUserId: '',
    reportedUserName: 'See conversation context',
    reportedUserAccountType: 'user',
    reporterId: r.reporterUserId || '',
    reporterName: r.reporterUserId || 'Unknown Reporter',
    reason: row.reason?.label || 'Unspecified',
    status: (r.status as ReportedChatStatus) || 'open',
    createdAt: r.createdAt,
    participantA: { id: r.reporterUserId || '', name: r.reporterUserId || 'Reporter' },
    participantB: { id: '', name: 'Other participant' },
    reportedMessageText: r.details || '(no message excerpt provided)',
    messages: [],
  };
}

export async function getAdminChatReports(params: ChatReportsQueryParams): Promise<{
  items: ReportedChatRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const queryParams: Record<string, string | number | undefined> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };
  if (params.status && params.status !== 'all') queryParams.status = params.status;

  const res = await apiClient.get<RawChatReportRow[]>('/admin/moderation/chat-reports', { params: queryParams });
  const rawList = res.data || [];
  return {
    items: rawList.map(normalizeChatReport),
    pagination: (res.pagination as { page: number; limit: number; total: number; totalPages: number }) || {
      page: Number(queryParams.page) || 1,
      limit: Number(queryParams.limit) || 20,
      total: rawList.length,
      totalPages: 1,
    },
  };
}

export interface ChatReportContext {
  report: {
    id: string;
    reasonId: string;
    details: string | null;
    status: string;
    createdAt: string;
  };
  conversation: {
    id: string;
    listing: unknown;
    participants: { userId: string; shopName: string }[];
  };
  messages: {
    id: string;
    conversationId: string;
    senderUserId: string;
    type: string;
    body: string;
    createdAt: string;
  }[];
}

export async function getAdminChatReportContext(id: string): Promise<ChatReportContext> {
  const res = await apiClient.get<ChatReportContext>(`/admin/moderation/chat-reports/${id}/context`);
  return res.data as ChatReportContext;
}

export function normalizeChatMessages(context: ChatReportContext): ReportedChatMessage[] {
  const nameByUserId = new Map(context.conversation.participants.map((p) => [p.userId, p.shopName]));
  return context.messages.map((m) => ({
    id: m.id,
    senderId: m.senderUserId,
    senderName: nameByUserId.get(m.senderUserId) || m.senderUserId,
    text: m.body,
    createdAt: new Date(m.createdAt).toLocaleString(),
  }));
}

export function updateChatReportStatus(id: string, status: 'resolved' | 'dismissed', resolutionNote?: string) {
  return apiClient.patch(`/admin/moderation/chat-reports/${id}`, { status, resolutionNote });
}
