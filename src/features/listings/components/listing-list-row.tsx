import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ListingCardData } from "@/types"
import { ImageSquare, ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"
import { FavoriteButton } from "./favorite-button"

interface ListingListRowProps {
  listing: ListingCardData
  featured?: boolean
  className?: string
}

import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import { formatCompactRelativeTime } from "@/lib/formatters/date"

export function ListingListRow({
  listing,
  featured = false,
  className,
}: ListingListRowProps) {
  const formattedPrice = listing.priceOnRequest
    ? "Contact for price"
    : formatPriceWithCurrency(listing.price, listing.currency)
  const timeAgo = formatCompactRelativeTime(listing.createdAt)
  const imageUrl = listing.primaryImage?.url ?? null
  const imageAlt = listing.primaryImage?.alt ?? listing.title
  const locationLabel = listing.location.label || listing.location.province
  const isFeatured = featured || listing.featured
  const metaLine = listing.metadata && listing.metadata.length > 0 ? listing.metadata.join(" • ") : null

  return (
    <Card
      className={cn(
        "group relative flex flex-row overflow-hidden rounded-xl border border-border/70 bg-card p-0 shadow-2xs transition-all duration-200 hover:border-primary/30 hover:shadow-md cursor-pointer",
        className
      )}
    >
      <Link
        href={`/listing/${listing.slug}`}
        className="absolute inset-0 z-0 focus-visible:outline-hidden"
        aria-label={listing.title}
      >
        <span className="sr-only">{listing.title}</span>
      </Link>

      <div className="relative w-36 sm:w-52 md:w-64 aspect-square sm:aspect-5/4 shrink-0 overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 208px, 256px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50" aria-hidden="true">
            <ImageSquare size={28} weight="light" />
          </div>
        )}
        <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none flex flex-col gap-1 items-start">
          {isFeatured && (
            <span className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Featured
            </span>
          )}
          {listing.urgent && (
            <span className="inline-flex items-center rounded-md bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Urgent
            </span>
          )}
        </div>
      </div>

      <CardContent className="flex min-w-0 flex-1 flex-col gap-1 p-3 sm:p-4 pointer-events-none">
        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
          {listing.title}
        </h3>

        <p className="flex items-center gap-1 text-xs text-muted-foreground sm:text-[13px]">
          <span className="shrink-0">{timeAgo}</span>
          <span aria-hidden="true">•</span>
          <span className="truncate">{locationLabel}</span>
          {listing.verified && (
            <ShieldCheck size={13} weight="fill" className="shrink-0 text-primary" aria-label="Verified Seller" />
          )}
        </p>

        {metaLine && (
          <p className="truncate text-xs text-muted-foreground sm:text-[13px]">{metaLine}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight text-destructive sm:text-xl">
              {formattedPrice}
            </span>
            {listing.negotiable && (
              <span className="text-[10px] font-medium text-muted-foreground">Negotiable</span>
            )}
          </div>
          <div className="pointer-events-auto relative z-10 shrink-0">
            <FavoriteButton
              listingId={listing.id}
              initialFavorited={listing.isFavorited}
              className="h-9 w-9 bg-transparent text-muted-foreground hover:bg-muted hover:text-destructive"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
