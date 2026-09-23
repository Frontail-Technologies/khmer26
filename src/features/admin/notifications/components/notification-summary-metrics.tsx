import {
  Bell,
  CheckCircle,
  FileText,
  Users,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { NotificationStats } from "../types"

interface NotificationSummaryMetricsProps {
  stats: NotificationStats
}

export function NotificationSummaryMetrics({ stats }: NotificationSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Broadcasts (30d)",
      value: stats.broadcasts30d.toLocaleString(),
      subtext: "System broadcasts",
      icon: <Bell size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Active Templates",
      value: stats.activeTemplates.toLocaleString(),
      subtext: "Automated triggers",
      icon: <FileText size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Delivery Rate",
      value: stats.deliveryRate,
      subtext: "Push & in-app delivery",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Audience Reach",
      value: stats.estimatedAudience,
      subtext: "Registered users",
      icon: <Users size={16} weight="bold" />,
      tone: "purple",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
