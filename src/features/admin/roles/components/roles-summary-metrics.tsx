import {
  ShieldCheck,
  UserGear,
  Eye,
  Headset,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { RoleStats } from "../types"

interface RolesSummaryMetricsProps {
  stats: RoleStats
}

export function RolesSummaryMetrics({ stats }: RolesSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Total Staff",
      value: stats.totalStaff.toLocaleString(),
      subtext: "Assigned operators",
      icon: <UserGear size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Super Admins",
      value: stats.superAdmins.toLocaleString(),
      subtext: "Full system access",
      icon: <ShieldCheck size={16} weight="bold" />,
      tone: "purple",
    },
    {
      label: "Moderators",
      value: stats.moderators.toLocaleString(),
      subtext: "Trust & safety queue",
      icon: <Eye size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Support Agents",
      value: stats.supportAgents.toLocaleString(),
      subtext: "Helpdesk handlers",
      icon: <Headset size={16} weight="bold" />,
      tone: "success",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
