import {
  Star,
  HourglassHigh,
  Prohibit,
  ThumbsUp,
} from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import type { AdminReviewStats } from "../types"

interface ReviewSummaryMetricsProps {
  stats: AdminReviewStats
}

export function ReviewSummaryMetrics({ stats }: ReviewSummaryMetricsProps) {
  const metrics: AdminMetricItemProps[] = [
    {
      label: "Average Rating",
      value: `${stats.averageRating.toFixed(1)} / 5.0`,
      subtext: "Marketplace average",
      icon: <Star size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Reviews (30d)",
      value: stats.reviews30d.toLocaleString(),
      subtext: stats.reviews30dGrowth,
      icon: <ThumbsUp size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Pending / Flagged",
      value: stats.pendingFlagged.toLocaleString(),
      subtext: "Awaiting review",
      icon: <HourglassHigh size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Removed / Hidden",
      value: stats.removedCount.toLocaleString(),
      subtext: "Moderated content",
      icon: <Prohibit size={16} weight="bold" />,
      tone: "destructive",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={4} />
}
