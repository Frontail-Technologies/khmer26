import { ClockCounterClockwise, ShieldCheck, UserCheck, LockKey } from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { AuditLogStats } from "../types"

interface AuditSummaryMetricsProps {
  stats: AuditLogStats
}

export function AuditSummaryMetrics({ stats }: AuditSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Events Today",
      value: stats.eventsToday.toLocaleString(),
      subtext: "Recorded operations",
      icon: <ClockCounterClockwise size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Staff Sessions",
      value: stats.adminLogins.toLocaleString(),
      subtext: "Active admin logins",
      icon: <UserCheck size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Moderation Actions",
      value: stats.moderationActions.toLocaleString(),
      subtext: "Enforcement records",
      icon: <ShieldCheck size={16} weight="bold" />,
      tone: "purple",
    },
    {
      label: "Security Incidents",
      value: `${stats.securityAlerts} Active`,
      subtext: "Policy alerts",
      icon: <LockKey size={16} weight="bold" />,
      tone: stats.securityAlerts > 0 ? "destructive" : "success",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
