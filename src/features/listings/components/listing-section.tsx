"use client"

import { cn } from "@/lib/utils"
import type { ListingCard as ListingCardType } from "@/types"
import { ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"
import type { ReactNode } from "react"
import { ListingGrid } from "./listing-grid"
import { ListingListRow } from "./listing-list-row"
import { ListingViewToggle } from "./listing-view-toggle"
import { useListingViewMode } from "../hooks/use-listing-view-mode"

interface ListingSectionProps {
  title: string
  description?: string
  icon?: ReactNode
  viewAllHref?: string
  listings: ListingCardType[]
  featured?: boolean
  className?: string
  showViewToggle?: boolean
}

export function ListingSection({
  title,
  description,
  icon,
  viewAllHref = "/search",
  listings,
  featured = false,
  className,
  showViewToggle = true,
}: ListingSectionProps) {
  const [viewMode, setViewMode] = useListingViewMode()

  return (
    <section className={cn("py-3 sm:py-4", className)}>
      <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            {icon && <span className="shrink-0">{icon}</span>}
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {showViewToggle && (
            <ListingViewToggle viewMode={viewMode} onChange={setViewMode} />
          )}

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-card/40">
          <p className="text-xs sm:text-sm text-muted-foreground">
            No listings available yet.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <ListingGrid listings={listings} featured={featured} />
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {listings.map((listing) => (
            <ListingListRow
              key={listing.id}
              listing={listing}
              featured={featured}
            />
          ))}
        </div>
      )}
    </section>
  )
}
