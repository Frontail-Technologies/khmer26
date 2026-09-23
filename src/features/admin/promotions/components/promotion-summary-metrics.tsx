import {
  Sparkle,
  TrendUp,
  Tag,
  Flame,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { PromotionStats } from "../types"

interface PromotionSummaryMetricsProps {
  stats: PromotionStats
}

export function PromotionSummaryMetrics({ stats }: PromotionSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Active Boosts",
      value: stats.activeBoosts.toLocaleString(),
      subtext: "Live paid promotions",
      icon: <Sparkle size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Featured Ads",
      value: stats.featuredAds.toLocaleString(),
      subtext: "Homepage spotlights",
      icon: <TrendUp size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Top Category Ads",
      value: stats.topCategoryAds.toLocaleString(),
      subtext: "Category priority",
      icon: <Tag size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Urgent Badges",
      value: stats.urgentBadges.toLocaleString(),
      subtext: "Quick-sale highlights",
      icon: <Flame size={16} weight="bold" />,
      tone: "warning",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
