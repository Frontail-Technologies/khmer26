import { useQuery } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  getAdminReports,
  getAdminReport,
  getAdminReportReasons,
  type AdminReportsQueryParams,
} from '../api/reports.api';

export function useAdminReports(params: AdminReportsQueryParams) {
  return useQuery({
    queryKey: adminKeys.reports.list(params),
    queryFn: () => getAdminReports(params),
  });
}

export function useAdminReportDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.reports.detail(id),
    queryFn: () => getAdminReport(id),
    enabled: !!id,
  });
}

export function useAdminReportReasons() {
  return useQuery({
    queryKey: adminKeys.reports.reasons(),
    queryFn: getAdminReportReasons,
  });
}
