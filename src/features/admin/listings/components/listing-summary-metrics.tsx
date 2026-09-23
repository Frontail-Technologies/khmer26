import {
  CheckCircle,
  HourglassHigh,
  WarningCircle,
  XCircle,
  CalendarCheck,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { AdminListingStats } from "../types"

interface ListingSummaryMetricsProps {
  stats: AdminListingStats
}

export function ListingSummaryMetrics({ stats }: ListingSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Active Listings",
      value: stats.active.toLocaleString("en-US"),
      subtext: "Published inventory",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Pending Review",
      value: stats.pending.toLocaleString("en-US"),
      subtext: "Awaiting approval",
      icon: <HourglassHigh size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Flagged / Reported",
      value: stats.flagged.toLocaleString("en-US"),
      subtext: "User complaints",
      icon: <WarningCircle size={16} weight="bold" />,
      tone: "destructive",
    },
    {
      label: "Removed / Rejected",
      value: stats.rejected.toLocaleString("en-US"),
      subtext: "Policy enforcement",
      icon: <XCircle size={16} weight="bold" />,
      tone: "neutral",
    },
    {
      label: "Submitted Today",
      value: stats.submittedToday.toLocaleString("en-US"),
      subtext: "Last 24h intake",
      icon: <CalendarCheck size={16} weight="bold" />,
      tone: "primary",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={5} />
}
