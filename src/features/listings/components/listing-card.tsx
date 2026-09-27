import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ListingCard as ListingCardType } from "@/types"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"
import { FavoriteButton } from "./favorite-button"

interface ListingCardProps {
  listing: ListingCardType
  featured?: boolean
  compact?: boolean
  className?: string
}

import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import { formatRelativeTime } from "@/lib/formatters/date"

export function ListingCard({
  listing,
  featured = false,
  compact = false,
  className,
}: ListingCardProps) {
  const formattedPrice = formatPriceWithCurrency(listing.price, listing.currency)
  const timeAgo = formatRelativeTime(listing.createdAt)
  const imageUrl = listing.primaryImage?.url ?? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
  const imageAlt = listing.primaryImage?.alt ?? listing.title
  const locationLabel = listing.location.label || listing.location.province
  const isFeatured = featured || listing.featured

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-0 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md cursor-pointer",
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
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
          <FavoriteButton
            listingId={listing.id}
            initialFavorited={listing.isFavorited}
            className={compact ? "h-6.5 w-6.5" : undefined}
          />
        </div>
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

      <CardContent className={cn(
        "flex flex-1 flex-col justify-between pointer-events-none",
        compact ? "p-2 sm:p-3" : "p-3"
      )}>
        <div>
          <div className="flex items-baseline justify-between gap-1">
            <span className={cn(
              "font-bold tracking-tight text-primary",
              compact ? "text-[15px] sm:text-lg sm:font-black" : "text-[17px] sm:text-lg sm:font-black"
            )}>
              {formattedPrice}
            </span>
            {listing.negotiable && (
              <span className={cn(
                "font-medium text-muted-foreground bg-muted/60 rounded-sm shrink-0",
                compact ? "text-[9px] px-1 py-0.2" : "text-[10px] px-1.5 py-0.5"
              )}>
                Negotiable
              </span>
            )}
          </div>

          <h3 className={cn(
            "block font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary leading-snug",
            compact ? "mt-0.5 text-xs sm:text-[13px]" : "mt-1 text-xs sm:text-[13px]"
          )}>
            {listing.title}
          </h3>

          {listing.metadata && listing.metadata.length > 0 && (
            <div className={cn(
              "flex items-center gap-1.5 text-muted-foreground truncate font-normal",
              compact ? "mt-1 text-[10px] sm:text-[11px]" : "mt-1.5 text-[11px]"
            )}>
              <span>{listing.metadata.join(" • ")}</span>
            </div>
          )}
        </div>

        <div className={cn(
          "flex items-center justify-between gap-1 border-t border-border/50 text-muted-foreground",
          compact ? "mt-2 pt-1.5 text-[10px] sm:text-[11px] sm:mt-3 sm:pt-2" : "mt-3 pt-2 text-[11px]"
        )}>
          <div className="flex items-center gap-1 min-w-0 max-w-[70%]">
            <span className="truncate">{locationLabel}</span>
            {listing.verified && (
              <ShieldCheck
                size={compact ? 13 : 14}
                weight="fill"
                className="text-primary shrink-0"
                aria-label="Verified Seller"
              />
            )}
          </div>
          <span className="shrink-0">{timeAgo}</span>
        </div>
      </CardContent>
    </Card>
  )
}
