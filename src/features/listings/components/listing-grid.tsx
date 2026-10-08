import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { ListingCardData } from "@/types"
import { ListingCard } from "./listing-card"

interface ListingGridProps {
  listings: ListingCardData[]
  featured?: boolean
  className?: string
  /** Rendered as the first grid cell, before the listings. */
  leadingItem?: ReactNode
}

export function ListingGrid({ listings, featured = false, className, leadingItem }: ListingGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-3.5",
        className
      )}
    >
      {leadingItem}
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          featured={featured}
        />
      ))}
    </div>
  )
}
