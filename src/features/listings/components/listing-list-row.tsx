import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ListingCard as ListingCardType } from "@/types"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"
import { FavoriteButton } from "./favorite-button"

interface ListingListRowProps {
  listing: ListingCardType
  featured?: boolean
  className?: string
}

function formatPrice(amount: number, currency: string = "USD"): string {
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US")}`
  }
  return `${amount.toLocaleString("en-US")} ${currency}`
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `${Math.max(1, diffMinutes)}m ago`
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  if (diffDays === 1) {
    return "1d ago"
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function ListingListRow({
  listing,
  featured = false,
  className,
}: ListingListRowProps) {
  const formattedPrice = formatPrice(listing.price, listing.currency)
  const timeAgo = formatRelativeTime(listing.createdAt)
  const imageUrl =
    listing.primaryImage?.url ??
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
  const imageAlt = listing.primaryImage?.alt ?? listing.title
  const locationLabel = listing.location.label || listing.location.province
  const isFeatured = featured || listing.featured

  return (
    <Card
      className={cn(
        "group relative flex flex-row overflow-hidden rounded-xl border border-border/80 bg-card p-0 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md cursor-pointer",
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

      <div className="relative w-28 sm:w-44 md:w-52 aspect-4/3 sm:aspect-16/10 shrink-0 overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 112px, (max-width: 768px) 176px, 208px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isFeatured && (
          <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
            <span className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Featured
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5 min-w-0 pointer-events-none">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary text-xs sm:text-[14px] leading-snug">
              {listing.title}
            </h3>
            <div className="pointer-events-auto shrink-0 relative z-10 -mr-1 -mt-1">
              <FavoriteButton
                listingId={listing.id}
                initialFavorited={listing.isFavorited}
              />
            </div>
          </div>

          {listing.metadata && listing.metadata.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground truncate font-normal">
              <span>{listing.metadata.join(" • ")}</span>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-border/40 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black tracking-tight text-primary">
              {formattedPrice}
            </span>
            {listing.negotiable && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1 py-0.2 rounded-sm shrink-0">
                Neg
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-0 truncate">
            <span className="truncate">{locationLabel}</span>
            {listing.verified && (
              <ShieldCheck
                size={13}
                weight="fill"
                className="text-primary shrink-0"
                aria-label="Verified Seller"
              />
            )}
            <span className="opacity-40">•</span>
            <span className="shrink-0">{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
