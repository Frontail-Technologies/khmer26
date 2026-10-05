import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminChatReports, getAdminChatReportContext, type ChatReportsQueryParams } from '../api/chat-reports.api';

export function useAdminChatReports(params: ChatReportsQueryParams = {}) {
  return useQuery({
    queryKey: adminKeys.reportedChats(params),
    queryFn: () => getAdminChatReports(params),
  });
}

export function useAdminChatReportContext(id: string, enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.chatReportContext(id),
    queryFn: () => getAdminChatReportContext(id),
    enabled: enabled && !!id,
  });
}
