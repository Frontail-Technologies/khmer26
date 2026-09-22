import { cn } from "@/lib/utils"
import type { ListingCard as ListingCardType } from "@/types"
import { ListingCard } from "./listing-card"

interface ListingGridProps {
  listings: ListingCardType[]
  featured?: boolean
  className?: string
}

export function ListingGrid({ listings, featured = false, className }: ListingGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-3.5",
        className
      )}
    >
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
