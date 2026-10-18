"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Star,
  User,
  Storefront,
  ShoppingBag,
  ArrowSquareOut,
  EyeSlash,
  ArrowCounterClockwise,
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/shared/status-badge"
import type { AdminReview } from "../types"

interface ReviewDetailSheetProps {
  review: AdminReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestHide: (review: AdminReview) => void
  onRestore: (id: string) => void
  onDismissReports: (id: string) => void
}

export function ReviewDetailSheet({
  review,
  open,
  onOpenChange,
  onRequestHide,
  onRestore,
  onDismissReports,
}: ReviewDetailSheetProps) {
  if (!review) return null

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-4 border-b border-border/60 bg-muted/20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-sm font-bold text-foreground">
                Review Details
              </SheetTitle>
              <StatusBadge
                label={review.status === "visible" ? "Visible" : "Hidden"}
                tone={review.status === "visible" ? "success" : "neutral"}
                size="sm"
              />
            </div>
            <span className="font-mono text-xxs text-muted-foreground">{review.displayId}</span>
          </div>
          <span className="text-xxs text-muted-foreground">
            Submitted on {review.createdAt}
          </span>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    weight="fill"
                    className={i < review.rating ? "text-accent" : "text-muted-foreground/25"}
                  />
                ))}
                <span className="font-bold text-xs text-foreground ml-1.5">
                  {review.rating}.0 / 5.0
                </span>
              </div>

              {review.reportsCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-2xs font-bold px-1.5 py-0 h-5 border-destructive/30 text-destructive bg-destructive/5"
                >
                  <WarningCircle size={11} className="mr-1" weight="fill" />
                  {review.reportsCount} {review.reportsCount === 1 ? "Report" : "Reports"}
                </Badge>
              )}
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </div>
          </div>

          {review.reportsCount > 0 && (
            <div className="p-3.5 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-destructive font-semibold">
                  <WarningCircle size={15} weight="fill" />
                  <span>Report Summary ({review.reportsCount} reports)</span>
                </div>
                {review.status === "visible" && (
                  <Button
                    variant="outline"
                    size="xs"
                    className="h-6 text-2xs border-destructive/30 text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => onDismissReports(review.id)}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Dismiss Reports
                  </Button>
                )}
              </div>
              {review.reportReasons && review.reportReasons.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-xxs text-muted-foreground block font-medium">
                    Reported reasons:
                  </span>
                  <ul className="space-y-1 pl-3 text-xxs text-muted-foreground list-disc">
                    {review.reportReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} />
                Reviewer
              </span>
              <Button
                variant="ghost"
                size="xs"
                className="h-6 text-xxs text-primary"
                render={
                  <Link href={`/admin/users/${review.reviewer.id}`}>
                    <ArrowSquareOut size={12} className="mr-1" />
                    View Account
                  </Link>
                }
              />
            </div>
            <div className="flex items-center gap-2.5 pt-0.5">
              <Avatar className="size-8.5 rounded-full border border-border/60">
                <AvatarImage src={review.reviewer.avatarUrl} alt={review.reviewer.name} />
                <AvatarFallback className="text-2xs font-bold bg-muted text-muted-foreground">
                  {reviewerInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <Link
                  href={`/admin/users/${review.reviewer.id}`}
                  className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
                >
                  {review.reviewer.name}
                </Link>
                <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                  <span>{review.reviewer.phone || "User account"}</span>
                </div>
              </div>
            </div>
            {review.reviewer.email && (
              <span className="text-xxs text-muted-foreground block truncate pt-0.5">
                Email: {review.reviewer.email}
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Storefront size={13} />
                Seller
              </span>
              <Button
                variant="ghost"
                size="xs"
                className="h-6 text-xxs text-primary"
                render={
                  <Link href={`/admin/users/${review.seller.id}`}>
                    <ArrowSquareOut size={12} className="mr-1" />
                    View Seller
                  </Link>
                }
              />
            </div>
            <div className="flex items-center gap-2.5 pt-0.5">
              <Avatar className="size-8.5 rounded-full border border-border/60">
                <AvatarImage src={review.seller.avatarUrl} alt={review.seller.name} />
                <AvatarFallback className="text-2xs font-bold bg-muted text-muted-foreground">
                  {sellerInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <Link
                  href={`/admin/users/${review.seller.id}`}
                  className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
                >
                  {review.seller.businessName || review.seller.name}
                </Link>
                <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                  <span>{review.seller.businessName ? review.seller.name : "Seller account"}</span>
                </div>
              </div>
            </div>
            {review.seller.rating !== undefined && (
              <div className="flex items-center gap-2 text-xxs text-muted-foreground pt-0.5">
                <span className="flex items-center text-accent font-semibold">
                  <Star size={11} weight="fill" className="mr-0.5" />
                  {review.seller.rating}
                </span>
                {review.seller.totalReviewsCount !== undefined && (
                  <>
                    <span>•</span>
                    <span>{review.seller.totalReviewsCount} Total Reviews</span>
                  </>
                )}
              </div>
            )}
          </div>

          {review.listing && (
            <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag size={13} />
                  Linked Listing
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 text-xxs text-primary"
                  render={
                    <Link href={`/admin/listings/${review.listing.id}`}>
                      <ArrowSquareOut size={12} className="mr-1" />
                      View Listing
                    </Link>
                  }
                />
              </div>
              <div className="flex items-center gap-2.5 pt-0.5">
                {review.listing.imageUrl && (
                  <div className="relative size-10 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted">
                    <Image
                      src={review.listing.imageUrl}
                      alt={review.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <Link
                    href={`/admin/listings/${review.listing.id}`}
                    className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
                  >
                    {review.listing.title}
                  </Link>
                  <span className="font-bold text-xxs text-primary block">
                    ${review.listing.price.toLocaleString()} {review.listing.currency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
          {review.status === "visible" ? (
            <Button
              variant="destructive"
              size="sm"
              className="w-full text-xs font-semibold cursor-pointer"
              onClick={() => onRequestHide(review)}
            >
              <EyeSlash size={14} className="mr-1.5" />
              Hide Review
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="w-full text-xs font-semibold cursor-pointer"
              onClick={() => onRestore(review.id)}
            >
              <ArrowCounterClockwise size={14} className="mr-1.5" />
              Restore Review
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
