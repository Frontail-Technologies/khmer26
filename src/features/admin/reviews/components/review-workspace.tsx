"use client"

import { useState, useMemo } from "react"
import { ReviewSummaryMetrics } from "./review-summary-metrics"
import { ReviewToolbar } from "./review-toolbar"
import { ReviewListItem } from "./review-list-item"
import { ReviewDetailPanel } from "./review-detail-panel"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { AdminReview, AdminReviewStats } from "../types"

interface ReviewWorkspaceProps {
  stats: AdminReviewStats
  initialReviews: AdminReview[]
}

export function ReviewWorkspace({ stats, initialReviews }: ReviewWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sellerTypeFilter, setSellerTypeFilter] = useState("all")
  const [reportedOnly, setReportedOnly] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<string>(initialReviews[0]?.id ?? "")
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const filteredReviews = useMemo(() => {
    return initialReviews.filter((rev) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesReviewer = rev.reviewer.name.toLowerCase().includes(q)
        const matchesSeller = rev.seller.name.toLowerCase().includes(q)
        const matchesBiz = rev.seller.businessName?.toLowerCase().includes(q) ?? false
        const matchesComment = rev.comment.toLowerCase().includes(q)
        const matchesId = rev.id.toLowerCase().includes(q)
        if (!matchesReviewer && !matchesSeller && !matchesBiz && !matchesComment && !matchesId) {
          return false
        }
      }

      if (ratingFilter !== "all" && rev.rating !== Number.parseInt(ratingFilter, 10)) {
        return false
      }

      if (statusFilter !== "all" && rev.status !== statusFilter) {
        return false
      }

      if (sellerTypeFilter !== "all" && rev.seller.sellerType !== sellerTypeFilter) {
        return false
      }

      if (reportedOnly && rev.reportsCount === 0) {
        return false
      }

      return true
    })
  }, [
    initialReviews,
    searchQuery,
    ratingFilter,
    statusFilter,
    sellerTypeFilter,
    reportedOnly,
  ])

  const selectedReview = useMemo(() => {
    return (
      filteredReviews.find((r) => r.id === selectedReviewId) ??
      filteredReviews[0] ??
      null
    )
  }, [filteredReviews, selectedReviewId])

  const hasActiveFilters =
    Boolean(searchQuery) ||
    ratingFilter !== "all" ||
    statusFilter !== "all" ||
    sellerTypeFilter !== "all" ||
    reportedOnly

  const handleReset = () => {
    setSearchQuery("")
    setRatingFilter("all")
    setStatusFilter("all")
    setSellerTypeFilter("all")
    setReportedOnly(false)
  }

  const handleSelectReview = (id: string) => {
    setSelectedReviewId(id)
    setMobileDetailOpen(true)
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <ReviewSummaryMetrics stats={stats} />

      <ReviewToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sellerTypeFilter={sellerTypeFilter}
        onSellerTypeChange={setSellerTypeFilter}
        reportedOnly={reportedOnly}
        onReportedOnlyChange={setReportedOnly}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialReviews.length}
        filteredCount={filteredReviews.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-6 space-y-2.5">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewListItem
                key={review.id}
                review={review}
                isSelected={selectedReview?.id === review.id}
                onSelect={() => handleSelectReview(review.id)}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-card rounded-xl shadow-2xs">
              <p className="text-xs text-muted-foreground">No reviews found matching the filters.</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:col-span-6 sticky top-4">
          <ReviewDetailPanel review={selectedReview} />
        </div>
      </div>

      <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
        <SheetContent side="bottom" className="h-[85vh] p-4 overflow-y-auto lg:hidden">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-sm font-semibold">Review Moderation</SheetTitle>
          </SheetHeader>
          <ReviewDetailPanel review={selectedReview} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
