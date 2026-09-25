"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "@phosphor-icons/react"
import type { ListingCard as ListingCardType } from "@/types"
import { ListingGrid } from "./listing-grid"
import { ListingListRow } from "./listing-list-row"
import { ListingViewToggle } from "./listing-view-toggle"
import { useListingViewMode } from "../hooks/use-listing-view-mode"
import { cn } from "@/lib/utils"

interface LatestListingsSectionProps {
  listings: ListingCardType[]
  className?: string
}

export function LatestListingsSection({
  listings,
  className,
}: LatestListingsSectionProps) {
  const [viewMode, setViewMode] = useListingViewMode()

  return (
    <section className={cn("py-3 sm:py-4", className)}>
      <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="shrink-0 text-accent">
            <Clock size={18} weight="bold" />
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
            Latest Listings
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <ListingViewToggle viewMode={viewMode} onChange={setViewMode} />

          <Link
            href="/search?sort=newest"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-card/40">
          <p className="text-xs sm:text-sm text-muted-foreground">
            No listings available yet.
          </p>
          <Link
            href="/post-ad"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Post an Ad
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <ListingGrid listings={listings} />
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {listings.map((listing) => (
            <ListingListRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}
