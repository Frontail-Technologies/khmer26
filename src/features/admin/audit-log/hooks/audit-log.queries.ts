import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import { getAdminAuditLogs } from '../api/audit-log.api';

export function useAdminAuditLogs(params?: { page?: number; limit?: number; action?: string; targetType?: string }) {
  return useQuery({
    queryKey: adminKeys.auditLogs.list(params),
    queryFn: () => getAdminAuditLogs(params),
  });
}
