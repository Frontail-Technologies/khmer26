"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ListingViewMode } from "./listing-view-toggle"
import { useListingViewMode } from "../hooks/use-listing-view-mode"

/** Same grid as ListingGrid, so swapping skeleton → cards causes no layout shift. */
export const LISTING_GRID_CLASS = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-3.5"

/** Mirrors ListingCard: 4:3 photo, two-line title, meta line, price + heart. */
export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xs", className)}>
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-3.5">
        <Skeleton className="h-4 w-11/12 sm:h-[18px]" />
        <Skeleton className="h-4 w-2/3 sm:h-[18px]" />
        <Skeleton className="mt-1 h-3 w-3/4" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/** Mirrors ListingListRow: square/5:4 photo on the left, details on the right. */
export function ListingRowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-row overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xs", className)}>
      <Skeleton className="aspect-square w-36 shrink-0 rounded-none sm:aspect-5/4 sm:w-52 md:w-64" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <Skeleton className="h-4 w-11/12 sm:h-5" />
        <Skeleton className="h-4 w-1/2 sm:h-5" />
        <Skeleton className="mt-1 h-3 w-2/3" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}

interface ListingFeedSkeletonProps {
  count?: number
  /** Defaults to the visitor's saved grid/list choice. */
  mode?: ListingViewMode
  gridClassName?: string
  /** Reserve the first grid cell (e.g. the Sell promo card on the home feed). */
  leadingCell?: boolean
  className?: string
}

export function ListingFeedSkeleton({ count = 10, mode, gridClassName, leadingCell, className }: ListingFeedSkeletonProps) {
  const [savedMode] = useListingViewMode()
  const resolved = mode ?? savedMode

  if (resolved === "list") {
    return (
      <div className={cn("space-y-2.5 sm:space-y-3", className)} aria-hidden="true">
        {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
          <ListingRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={cn(LISTING_GRID_CLASS, gridClassName, className)} aria-hidden="true">
      {leadingCell && <Skeleton className="min-h-64 w-full rounded-xl" />}
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Mirrors the "Latest listings" header row: clock + title, view toggle, view all. */
export function ListingSectionHeaderSkeleton({ withToggle = true }: { withToggle?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3">
      <Skeleton className="h-6 w-40 sm:h-7 sm:w-48" />
      <div className="flex items-center gap-2.5 sm:gap-3">
        {withToggle && <Skeleton className="h-8 w-[60px] rounded-lg" />}
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  )
}
