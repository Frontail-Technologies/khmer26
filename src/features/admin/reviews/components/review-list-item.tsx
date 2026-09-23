"use client"

import { Star, CheckCircle, WarningOctagon } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import type { AdminReview } from "../types"

interface ReviewListItemProps {
  review: AdminReview
  isSelected: boolean
  onSelect: () => void
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  approved: { label: "Approved", tone: "success" },
  flagged: { label: "Flagged", tone: "warning" },
  pending: { label: "Pending", tone: "warning" },
  removed: { label: "Removed", tone: "destructive" },
}

export function ReviewListItem({ review, isSelected, onSelect }: ReviewListItemProps) {
  const conf = STATUS_CONFIG[review.status] || { label: review.status, tone: "neutral" as StatusTone }
  const reviewerInitials = review.reviewer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "p-3 cursor-pointer transition-all border text-left",
        isSelected
          ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
          : "bg-card border-border/80 hover:border-border hover:bg-muted/20"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="size-7 rounded-md shrink-0 border border-border/60">
            <AvatarImage src={review.reviewer.avatarUrl} alt={review.reviewer.name} />
            <AvatarFallback className="text-[10px] font-semibold bg-muted text-muted-foreground rounded-md">
              {reviewerInitials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 min-w-0">
            <span className="font-semibold text-xs text-foreground block truncate">
              {review.reviewer.name}
            </span>
            <span className="text-[10px] text-muted-foreground block truncate">
              To: {review.seller.businessName || review.seller.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center text-amber-500 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded">
            <Star size={11} weight="fill" className="mr-0.5" />
            {review.rating}
          </div>
          <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
        </div>
      </div>

      <p className="text-xs text-foreground line-clamp-2 leading-relaxed mb-2.5">
        {review.comment}
      </p>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <span>{review.createdAt}</span>
          {review.isVerifiedPurchase && (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle size={11} weight="fill" />
              Verified
            </span>
          )}
        </div>

        {review.reportsCount > 0 && (
          <Badge variant="destructive" className="text-[9px] font-bold px-1 py-0 h-4">
            <WarningOctagon size={10} className="mr-0.5" />
            {review.reportsCount} Reports
          </Badge>
        )}
      </div>
    </Card>
  )
}
