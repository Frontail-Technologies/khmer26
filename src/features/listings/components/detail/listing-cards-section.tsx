import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import type { ListingCardData } from "@/types"
import { ListingGrid } from "../listing-grid"

interface ListingCardsSectionProps {
  title: string
  listings: ListingCardData[]
  viewAllHref?: string
}

/** Four cards per row on desktop, built on the shared listing card. */
export function ListingCardsSection({ title, listings, viewAllHref }: ListingCardsSectionProps) {
  if (listings.length === 0) return null

  return (
    <section aria-label={title} className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
          >
            <span>View all</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
      <ListingGrid
        listings={listings}
        className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4"
      />
    </section>
  )
}
