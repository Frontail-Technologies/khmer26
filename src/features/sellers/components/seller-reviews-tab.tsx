"use client"

import { Star, ChatText } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Page, SellerProfile, SellerReview } from "../api/sellers.api"
import { distributionPercent, formatReviewDate, pluralize, sellerInitials } from "../lib/seller-format"
import { SellerReviewForm } from "./seller-review-form"

interface SellerReviewsTabProps {
  seller: SellerProfile
  isOwnProfile: boolean
  pages: Array<Page<SellerReview>> | undefined
  isPending: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  onRetry: () => void
}

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="flex items-center gap-0.5 text-accent" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} weight={s <= Math.round(value) ? "fill" : "regular"} />
      ))}
    </span>
  )
}

export function SellerReviewsTab({
  seller,
  isOwnProfile,
  pages,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
}: SellerReviewsTabProps) {
  const rating = seller.rating
  const reviews = (pages ?? []).flatMap((p) => p.items)

  return (
    <div className="space-y-5">
      {rating ? (
        <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">Ratings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                <span className="text-4xl sm:text-5xl font-black text-foreground">
                  {rating.average.toFixed(1)}
                </span>
                <div className="my-2">
                  <Stars value={rating.average} size={20} />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Based on {pluralize(rating.count, "review")}
                </span>
              </div>

              <div className="md:col-span-8 space-y-2">
                {([5, 4, 3, 2, 1] as const).map((stars) => {
                  const count = rating.distribution[stars]
                  const percent = distributionPercent(count, rating.count)
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-6 font-semibold text-foreground text-right shrink-0">{stars}★</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground shrink-0">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <SellerReviewForm sellerId={seller.id} isOwnProfile={isOwnProfile} />

      {isPending ? (
        <div aria-busy="true" aria-label="Loading reviews" className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : isError && !pages ? (
        <EmptyState
          icon={<ChatText size={32} aria-hidden="true" />}
          title="Couldn't load reviews"
          description="Please check your connection and try again."
          action={{ label: "Try again", onClick: onRetry }}
        />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<ChatText size={32} aria-hidden="true" />}
          title="No reviews yet"
          description={`${seller.shopName} hasn't received any reviews yet.`}
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs"
            >
              <CardContent className="p-0 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="default" className="h-10 w-10 border border-border/70">
                      <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                        {sellerInitials(review.reviewer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <span className="block truncate text-xs sm:text-sm font-bold text-foreground">
                        {review.reviewer.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    <Stars value={review.rating} size={14} />
                  </div>
                </div>

                {review.comment?.trim() && (
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line wrap-anywhere">
                    {review.comment.trim()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {isError && (
            <p role="alert" className="text-center text-xs font-medium text-destructive">
              Couldn&apos;t load more reviews.
            </p>
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="h-10 px-6 text-xs sm:text-sm font-semibold rounded-lg border-border hover:bg-muted"
              >
                {isFetchingNextPage ? "Loading…" : "Load more reviews"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
