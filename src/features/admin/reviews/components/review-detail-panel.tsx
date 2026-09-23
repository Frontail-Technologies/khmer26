"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Star,
  CheckCircle,
  User,
  Storefront,
  ShoppingBag,
  ClockCounterClockwise,
  ArrowSquareOut,
  Prohibit,
  WarningCircle,
  ShieldCheck,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ReviewActionDialogs } from "./review-action-dialogs"
import type { AdminReview } from "../types"

interface ReviewDetailPanelProps {
  review: AdminReview | null
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  approved: { label: "Approved", tone: "success" },
  flagged: { label: "Flagged", tone: "warning" },
  pending: { label: "Pending", tone: "warning" },
  removed: { label: "Removed", tone: "destructive" },
}

export function ReviewDetailPanel({ review }: ReviewDetailPanelProps) {
  const [activeDialog, setActiveDialog] = useState<"keep" | "remove" | "escalate" | null>(null)

  if (!review) {
    return (
      <Card className="h-full min-h-[300px] flex items-center justify-center p-6 text-center bg-card border-0 shadow-2xs rounded-xl">
        <p className="text-xs text-muted-foreground">Select a review from the feed to inspect details and moderate.</p>
      </Card>
    )
  }

  const conf = STATUS_CONFIG[review.status] || { label: review.status, tone: "neutral" as StatusTone }
  const reviewerInitials = review.reviewer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const sellerInitials = (review.seller.businessName || review.seller.name)
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <>
      <div className="space-y-3.5">
        <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Review Inspection ({review.id})
              </CardTitle>
              <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
            </div>
            <span className="text-[11px] text-muted-foreground">{review.createdAt}</span>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      weight={i < review.rating ? "fill" : "regular"}
                      className={i < review.rating ? "text-amber-500" : "text-muted-foreground/30"}
                    />
                  ))}
                  <span className="font-bold text-sm text-foreground ml-1.5">{review.rating}.0 / 5.0</span>
                </div>

                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle size={13} weight="fill" />
                    Verified Marketplace Purchase
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 text-xs text-foreground leading-relaxed">
                {review.comment}
              </div>

              {review.flagReason && (
                <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive space-y-0.5">
                  <span className="font-semibold block">Dispute / Flag Reason:</span>
                  <p className="text-[11px] leading-relaxed">{review.flagReason}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User size={13} />
                  Reviewer (Buyer)
                </span>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 rounded-md border border-border/60">
                    <AvatarImage src={review.reviewer.avatarUrl} alt={review.reviewer.name} />
                    <AvatarFallback className="text-[10px] font-semibold bg-muted text-muted-foreground">
                      {reviewerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      href={`/admin/users/${review.reviewer.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {review.reviewer.name}
                    </Link>
                    <span className="text-[10px] text-muted-foreground block">{review.reviewer.id}</span>
                  </div>
                </div>
                {review.reviewer.phone && (
                  <span className="text-[11px] text-muted-foreground block truncate">
                    Phone: {review.reviewer.phone}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Storefront size={13} />
                  Reviewed Seller
                </span>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 rounded-md border border-border/60">
                    <AvatarImage src={review.seller.avatarUrl} alt={review.seller.name} />
                    <AvatarFallback className="text-[10px] font-semibold bg-muted text-muted-foreground">
                      {sellerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      href={`/admin/users/${review.seller.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {review.seller.businessName || review.seller.name}
                    </Link>
                    <span className="text-[10px] text-muted-foreground block">{review.seller.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center text-amber-500 font-semibold">
                    <Star size={11} weight="fill" className="mr-0.5" />
                    {review.seller.rating}
                  </span>
                  <span>•</span>
                  <span>{review.seller.totalReviewsCount} Total Reviews</span>
                </div>
              </div>
            </div>

            {review.listing && (
              <div className="p-3 rounded-lg bg-background border border-border/70 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag size={13} />
                    Linked Listing
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    render={
                      <Link href={`/admin/listings/${review.listing.id}`}>
                        <ArrowSquareOut size={12} className="mr-1" />
                        View Listing
                      </Link>
                    }
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-foreground truncate">{review.listing.title}</span>
                  <span className="font-bold text-foreground shrink-0 ml-2">
                    ${review.listing.price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1 border-t border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ClockCounterClockwise size={13} />
                Moderation Timeline
              </span>
              <div className="space-y-2">
                {review.moderationHistory.map((item) => (
                  <div key={item.id} className="text-xs space-y-0.5 bg-muted/20 p-2 rounded-md border border-border/40">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-foreground">{item.action}</span>
                      <span className="text-muted-foreground">{item.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">By: {item.actor}</span>
                    {item.note && <p className="text-[11px] text-muted-foreground mt-1">{item.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                onClick={() => setActiveDialog("keep")}
              >
                <ShieldCheck size={14} className="mr-1.5 text-emerald-500" />
                Keep Review
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs flex-1 text-destructive hover:text-destructive"
                onClick={() => setActiveDialog("remove")}
              >
                <Prohibit size={14} className="mr-1.5 text-destructive" />
                Remove Review
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="text-xs flex-1"
                onClick={() => setActiveDialog("escalate")}
              >
                <WarningCircle size={14} className="mr-1.5 text-amber-500" />
                Escalate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ReviewActionDialogs
        review={review}
        actionType={activeDialog}
        onClose={() => setActiveDialog(null)}
      />
    </>
  )
}
