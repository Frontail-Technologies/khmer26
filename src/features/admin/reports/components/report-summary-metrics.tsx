import {
  WarningCircle,
  HourglassHigh,
  Flame,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { AdminReportStats } from "../types"

interface ReportSummaryMetricsProps {
  stats: AdminReportStats
}

export function ReportSummaryMetrics({ stats }: ReportSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Open Reports",
      value: stats.open.toLocaleString("en-US"),
      subtext: "Awaiting review",
      icon: <WarningCircle size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "In Review",
      value: stats.inReview.toLocaleString("en-US"),
      subtext: "Being inspected",
      icon: <HourglassHigh size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Urgent Priority",
      value: stats.urgent.toLocaleString("en-US"),
      subtext: "High-risk flags",
      icon: <Flame size={16} weight="bold" />,
      tone: "destructive",
    },
    {
      label: "Resolved (30d)",
      value: stats.resolved30d.toLocaleString("en-US"),
      subtext: "Closed cases",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Avg Resolution",
      value: `${stats.avgResolutionHours} hrs`,
      subtext: "SLA < 6 hours",
      icon: <Clock size={16} weight="bold" />,
      tone: "primary",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={5} />
}
