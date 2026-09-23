import {
  HourglassHigh,
  CheckCircle,
  XCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { VerificationStats } from "../data/demo-verification-stats"

interface VerificationSummaryMetricsProps {
  stats: VerificationStats
}

export function VerificationSummaryMetrics({ stats }: VerificationSummaryMetricsProps) {
  const avgHours = (stats.averageReviewMinutes / 60).toFixed(1)

  const metrics: AdminMetricItemProps[] = [
    {
      label: "Pending Review",
      value: stats.pending,
      subtext: `${stats.inReview} in review`,
      icon: <HourglassHigh size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Approved (30d)",
      value: stats.approved30d,
      subtext: "Badges granted",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Rejected (30d)",
      value: stats.rejected30d,
      subtext: "Eligibility issues",
      icon: <XCircle size={16} weight="bold" />,
      tone: "destructive",
    },
    {
      label: "Avg Review Time",
      value: `${avgHours} hrs`,
      subtext: "SLA < 6 hours",
      icon: <Clock size={16} weight="bold" />,
      tone: "primary",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
