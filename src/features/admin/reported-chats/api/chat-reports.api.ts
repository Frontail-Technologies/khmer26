import { apiClient } from '@/lib/api/client';
import type { ReportedChatRecord, ReportedChatStatus, ReportedChatMessage } from '../types';
import { formatAdminDateTime } from '@/lib/formatters/date';

export interface RawChatReportRow {
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

interface AdminChatReportDto {
  id: string;
  displayId: string;
  target: { id: string; displayId?: string; title: string };
  reporter: { id?: string; name: string; accountType: string };
  reasonLabel: string;
  statement: string;
  status: string;
  createdAt: string;
}

export interface ChatReportsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  [key: string]: string | number | undefined;
}

export function normalizeChatReport(row: RawChatReportRow | AdminChatReportDto): ReportedChatRecord {
  if ('target' in row) {
    return {
      id: row.id,
      displayId: row.displayId,
      conversationId: row.target.id,
      conversationDisplayId: row.target.displayId || 'CHAT',
      reportedUserId: '',
      reportedUserName: 'See conversation context',
      reportedUserAccountType: 'user',
      reporterId: row.reporter.id || '',
      reporterName: row.reporter.name,
      reason: row.reasonLabel,
      status: (row.status as ReportedChatStatus) || 'open',
      createdAt: row.createdAt,
      participantA: { id: row.reporter.id || '', name: row.reporter.name },
      participantB: { id: '', name: 'Other participant' },
      reportedMessageText: row.statement || '(no message excerpt provided)',
      messages: [],
    };
  }

  const r = row.report;
  return {
    id: r.id,
    displayId: 'RPT',
    conversationId: r.conversationId || '',
    conversationDisplayId: 'CHAT',
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

  const res = await apiClient.get<Array<RawChatReportRow | AdminChatReportDto>>('/admin/moderation/chat-reports', { params: queryParams });
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
    displayId: string;
    reasonId: string;
    details: string | null;
    status: string;
    createdAt: string;
  };
  conversation: {
    id: string;
    displayId: string;
    listing: {
      id: string;
      title: string;
      price: string | number;
      currency: string;
      imageUrl?: string;
    };
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
    createdAt: formatAdminDateTime(m.createdAt),
  }));
}

export function updateChatReportStatus(id: string, status: 'resolved' | 'dismissed', resolutionNote?: string) {
  return apiClient.patch(`/admin/moderation/chat-reports/${id}`, { status, resolutionNote });
}
