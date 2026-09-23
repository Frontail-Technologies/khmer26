import {
  Crown,
  TrendUp,
  Buildings,
  CurrencyDollar,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { SubscriptionStats } from "../types"

interface SubscriptionSummaryMetricsProps {
  stats: SubscriptionStats
}

export function SubscriptionSummaryMetrics({ stats }: SubscriptionSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Active Pro Sellers",
      value: stats.activeProSellers.toLocaleString(),
      subtext: stats.activeProGrowth,
      icon: <Crown size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Enterprise Stores",
      value: stats.enterpriseStores.toLocaleString(),
      subtext: "Brand flagships",
      icon: <Buildings size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Monthly Churn Rate",
      value: stats.monthlyChurnRate,
      subtext: "Retention rate",
      icon: <TrendUp size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Monthly Recurring (MRR)",
      value: stats.mrrDisplay,
      subtext: "Subscription throughput",
      icon: <CurrencyDollar size={16} weight="bold" />,
      tone: "success",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
