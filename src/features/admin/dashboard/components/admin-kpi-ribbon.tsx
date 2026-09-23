import {
  SquaresFour,
  Sparkle,
  CheckCircle,
  Hourglass,
  Handshake,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"

export function AdminKpiRibbon() {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Total Ads",
      value: "48,290",
      subtext: "Cumulative volume",
      icon: <SquaresFour size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Featured Ads",
      value: "1,280",
      subtext: "Promoted campaigns",
      icon: <Sparkle size={16} weight="bold" />,
      tone: "purple",
    },
    {
      label: "Active Ads",
      value: "42,850",
      subtext: "Live on marketplace",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Expired Ads",
      value: "4,160",
      subtext: "Awaiting renewal",
      icon: <Hourglass size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Sold Ads",
      value: "1,940",
      subtext: "Closed transactions",
      icon: <Handshake size={16} weight="bold" />,
      tone: "indigo",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={5} />
}
