"use client"

import { useQuery } from "@tanstack/react-query"
import { adminKeys } from "@/lib/query/keys"
import { getAdminDashboard } from "@/features/admin/dashboard/api/dashboard.api"
import type { AdminCountKey } from "./admin-navigation"

/**
 * Live "waiting for you" counters for the menu badges and the Queue. Shares the dashboard query
 * (same key) and refreshes every minute.
 */
export function useAdminQueueCounts(): Record<AdminCountKey, number> & { isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: adminKeys.dashboard.overview(),
    queryFn: getAdminDashboard,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
  const listings = (data?.listings?.pendingReview ?? 0) + (data?.listings?.flagged ?? 0)
  const verifications = data?.sellers?.pendingVerification ?? 0
  const reports = data?.reports?.open ?? 0
  return { queue: listings + verifications + reports, listings, verifications, reports, isLoading }
}
