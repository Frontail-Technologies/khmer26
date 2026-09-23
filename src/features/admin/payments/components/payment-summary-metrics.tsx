import {
  CurrencyDollar,
  CheckCircle,
  HourglassHigh,
  ArrowUUpLeft,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { PaymentFinancialStats } from "../types"

interface PaymentSummaryMetricsProps {
  stats: PaymentFinancialStats
}

export function PaymentSummaryMetrics({ stats }: PaymentSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Total Volume (30d)",
      value: stats.totalVolume,
      subtext: stats.totalVolumeGrowth,
      icon: <CurrencyDollar size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Completed Transactions",
      value: stats.successfulCount.toLocaleString(),
      subtext: "Successful payments",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Pending Settlement",
      value: stats.pendingCount.toLocaleString(),
      subtext: "Gateway processing",
      icon: <HourglassHigh size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Refunded / Disputed",
      value: stats.failedRefundedCount.toLocaleString(),
      subtext: "Failed or reversed",
      icon: <ArrowUUpLeft size={16} weight="bold" />,
      tone: "destructive",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
