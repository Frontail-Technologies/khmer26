"use client"

import { Storefront } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { ListingListRow } from "@/features/listings/components/listing-list-row"
import { ListingViewToggle } from "@/features/listings/components/listing-view-toggle"
import { useListingViewMode } from "@/features/listings/hooks/use-listing-view-mode"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import type { PublicListing } from "@/features/listings/api/listings.api"
import type { Page } from "../api/sellers.api"
import { pluralize } from "../lib/seller-format"

interface SellerListingsTabProps {
  sellerName: string
  pages: Array<Page<PublicListing>> | undefined
  isPending: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  onRetry: () => void
}

export function SellerListingsTab({
  sellerName,
  pages,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
}: SellerListingsTabProps) {
  const [viewMode, setViewMode] = useListingViewMode()

  if (isPending) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading listings"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/5 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError && !pages) {
    return (
      <EmptyState
        icon={<Storefront size={32} aria-hidden="true" />}
        title="Couldn't load listings"
        description="Please check your connection and try again."
        action={{ label: "Try again", onClick: onRetry }}
      />
    )
  }

  const items = (pages ?? []).flatMap((p) => p.items)
  const total = pages?.[0]?.pagination.total ?? 0

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Storefront size={32} aria-hidden="true" />}
        title="No active listings"
        description={`${sellerName} has no active listings at the moment.`}
      />
    )
  }

  const cards = items.map(toListingCardData)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <span>
          Showing {items.length} of {pluralize(total, "active listing")}
        </span>
        <ListingViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <ListingGrid listings={cards} />
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {cards.map((listing) => (
            <ListingListRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {isError && (
        <p role="alert" className="text-center text-xs font-medium text-destructive">
          Couldn&apos;t load more listings.
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
            {isFetchingNextPage ? "Loading…" : "Load more listings"}
          </Button>
        </div>
      )}
    </div>
  )
}
