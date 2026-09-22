"use client"

import { useState } from "react"
import { Star, ShieldCheck, ChatText } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/shared/EmptyState"
import type { SellerReview, SellerProfileDetail } from "../types"

interface SellerReviewsTabProps {
  seller: SellerProfileDetail
  reviews: SellerReview[]
}

export function SellerReviewsTab({ seller, reviews }: SellerReviewsTabProps) {
  const [filterRating, setFilterRating] = useState<number | "all">("all")

  const distribution = [
    { stars: 5, percentage: 85, count: Math.round(seller.reviewCount * 0.85) },
    { stars: 4, percentage: 11, count: Math.round(seller.reviewCount * 0.11) },
    { stars: 3, percentage: 3, count: Math.round(seller.reviewCount * 0.03) },
    { stars: 2, percentage: 1, count: Math.round(seller.reviewCount * 0.01) },
    { stars: 1, percentage: 0, count: 0 },
  ]

  const filteredReviews = reviews.filter((rev) => {
    if (filterRating === "all") return true
    return rev.rating === filterRating
  })

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
            Customer Feedback & Ratings
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
              <span className="text-4xl sm:text-5xl font-black text-foreground">
                {seller.rating.toFixed(1)}
              </span>

              <div className="flex items-center gap-1 my-2 text-accent">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    weight={s <= Math.round(seller.rating) ? "fill" : "regular"}
                  />
                ))}
              </div>

              <span className="text-xs text-muted-foreground font-medium">
                Based on {seller.reviewCount} verified reviews
              </span>
            </div>

            <div className="md:col-span-8 space-y-2">
              {distribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 font-semibold text-foreground text-right shrink-0">
                    {dist.stars}★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-muted-foreground shrink-0">
                    {dist.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterRating("all")}
          className={`h-8 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filterRating === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          All Reviews ({reviews.length})
        </button>

        {[5, 4, 3].map((stars) => {
          const count = reviews.filter((r) => r.rating === stars).length
          if (count === 0 && filterRating !== stars) return null

          return (
            <button
              key={stars}
              type="button"
              onClick={() => setFilterRating(stars)}
              className={`h-8 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterRating === stars
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {stars} Stars ({count})
            </button>
          )
        })}
      </div>

      {filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review) => {
            const initials = review.authorName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            return (
              <Card
                key={review.id}
                className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs transition-colors hover:border-primary/30"
              >
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="default" className="h-10 w-10 border border-border/70">
                        {review.authorAvatar && (
                          <AvatarImage
                            src={review.authorAvatar}
                            alt={review.authorName}
                          />
                        )}
                        <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-foreground">
                            {review.authorName}
                          </span>
                          {review.verifiedPurchase && (
                            <ShieldCheck
                              size={15}
                              weight="fill"
                              className="text-primary shrink-0"
                              aria-label="Verified Purchase"
                            />
                          )}
                        </div>

                        <span className="text-[11px] text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-accent shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          weight={s <= review.rating ? "fill" : "regular"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                    {review.comment}
                  </p>

                  {review.listingTitle && (
                    <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center gap-1">
                      <span>Item:</span>
                      <span className="font-medium text-foreground truncate">
                        {review.listingTitle}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<ChatText size={32} aria-hidden="true" />}
          title="No reviews match your filter"
          description="Try selecting another star rating or viewing all reviews."
          action={{
            label: "View All Reviews",
            onClick: () => setFilterRating("all"),
          }}
        />
      )}
    </div>
  )
}
