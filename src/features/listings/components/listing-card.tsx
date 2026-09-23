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

export function ListingCard({ listing, featured = false, className }: ListingCardProps) {
  const formattedPrice = formatPrice(listing.price, listing.currency)
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
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            listingId={listing.id}
            initialFavorited={listing.isFavorited}
          />
        </div>
        {isFeatured && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-xs">
              Featured
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col justify-between p-3 pointer-events-none">
        <div>
          <div className="flex items-baseline justify-between gap-1.5">
            <span className="text-[17px] sm:text-lg font-black tracking-tight text-primary">
              {formattedPrice}
            </span>
            {listing.negotiable && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-sm shrink-0">
                Negotiable
              </span>
            )}
          </div>

          <h3 className="mt-1 block font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary text-xs sm:text-[13px] leading-snug">
            {listing.title}
          </h3>

          {listing.metadata && listing.metadata.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground truncate font-normal">
              <span>{listing.metadata.join(" • ")}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 min-w-0 max-w-[70%]">
            <span className="truncate">{locationLabel}</span>
            {listing.verified && (
              <ShieldCheck
                size={14}
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
