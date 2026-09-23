import {
  Users,
  Storefront,
  Buildings,
  Prohibit,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { AdminUserStats } from "../types"

interface UserSummaryMetricsProps {
  stats: AdminUserStats
}

export function UserSummaryMetrics({ stats }: UserSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Total Accounts",
      value: stats.totalAccounts.toLocaleString("en-US"),
      subtext: stats.totalAccountsGrowth,
      icon: <Users size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Active Sellers",
      value: stats.activeSellers.toLocaleString("en-US"),
      subtext: stats.activeSellersGrowth,
      icon: <Storefront size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Business & Dealers",
      value: stats.businessDealers.toLocaleString("en-US"),
      subtext: "Merchant storefronts",
      icon: <Buildings size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Suspended / Restricted",
      value: stats.suspendedRestricted.toLocaleString("en-US"),
      subtext: "Policy enforcement",
      icon: <Prohibit size={16} weight="bold" />,
      tone: "destructive",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
