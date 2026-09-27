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
      label: "Total Listings",
      value: "48,290",
      subtext: "Cumulative volume",
      icon: <SquaresFour size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Featured Listings",
      value: "1,280",
      subtext: "Promoted campaigns",
      icon: <Sparkle size={16} weight="bold" />,
      tone: "accent",
    },
    {
      label: "Active Listings",
      value: "42,850",
      subtext: "Live on marketplace",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Expired Listings",
      value: "4,160",
      subtext: "Awaiting renewal",
      icon: <Hourglass size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Sold Listings",
      value: "1,940",
      subtext: "Closed transactions",
      icon: <Handshake size={16} weight="bold" />,
      tone: "neutral",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={5} />
}
