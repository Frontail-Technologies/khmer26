import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ListingCardData } from "@/types"
import { ImageSquare, ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"
import { FavoriteButton } from "./favorite-button"

interface ListingCardProps {
  listing: ListingCardData
  featured?: boolean
  compact?: boolean
  className?: string
}

import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import { formatCompactRelativeTime } from "@/lib/formatters/date"

export function ListingCard({
  listing,
  featured = false,
  compact = false,
  className,
}: ListingCardProps) {
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
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card p-0 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md cursor-pointer",
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

      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50" aria-hidden="true">
            <ImageSquare size={32} weight="light" />
          </div>
        )}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 pointer-events-none flex flex-col gap-1 items-start">
          {isFeatured && (
            <span className={cn(
              "inline-flex items-center rounded-md bg-accent text-accent-foreground font-bold tracking-wider uppercase shadow-xs",
              compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
            )}>
              Featured
            </span>
          )}
          {listing.urgent && (
            <span className={cn(
              "inline-flex items-center rounded-md bg-destructive text-destructive-foreground font-bold tracking-wider uppercase shadow-xs",
              compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
            )}>
              Urgent
            </span>
          )}
        </div>
      </div>

      <CardContent
        className={cn(
          "flex flex-1 flex-col pointer-events-none",
          compact ? "gap-0.5 p-2.5" : "gap-1 p-3 sm:p-3.5"
        )}
      >
        <h3
          className={cn(
            "line-clamp-2 font-medium leading-snug text-foreground transition-colors group-hover:text-primary",
            compact ? "text-sm" : "text-[15px] sm:text-base"
          )}
        >
          {listing.title}
        </h3>

        <p className={cn("flex items-center gap-1 text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
          <span className="shrink-0">{timeAgo}</span>
          <span aria-hidden="true">•</span>
          <span className="truncate">{locationLabel}</span>
          {listing.verified && (
            <ShieldCheck
              size={compact ? 13 : 14}
              weight="fill"
              className="shrink-0 text-primary"
              aria-label="Verified Seller"
            />
          )}
        </p>

        {metaLine && (
          <p className={cn("truncate text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
            {metaLine}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <span
              className={cn(
                "block truncate font-extrabold tracking-tight text-destructive",
                compact ? "text-base" : "text-lg"
              )}
            >
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
              className="h-8 w-8 bg-transparent text-muted-foreground hover:bg-muted hover:text-destructive"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
