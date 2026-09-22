import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AccountListingStatus } from "../../types"

interface ListingStatusBadgeProps {
  status: AccountListingStatus
  className?: string
}

function getListingTone(status: AccountListingStatus): { label: string; tone: StatusTone } {
  switch (status) {
    case "active":
      return { label: "Active", tone: "success" }
    case "pending":
      return { label: "Pending Review", tone: "warning" }
    case "sold":
      return { label: "Sold", tone: "neutral" }
    case "draft":
      return { label: "Draft", tone: "info" }
    case "expired":
      return { label: "Expired", tone: "destructive" }
    case "paused":
      return { label: "Paused", tone: "neutral" }
    default:
      return { label: status, tone: "neutral" }
  }
}

export function ListingStatusBadge({
  status,
  className,
}: ListingStatusBadgeProps) {
  const { label, tone } = getListingTone(status)

  return (
    <StatusBadge
      label={label}
      tone={tone}
      className={className}
    />
  )
}
