import Link from "next/link"
import { ArrowRight, CalendarBlank, ShieldCheck, Star } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getMediaUrl } from "@/lib/media/get-media-url"
import type { ListingDetail } from "../../api/listing-detail.api"
import { formatMemberSince, sellerTypeLabel } from "../../lib/listing-detail-format"

interface ListingSellerCardProps {
  seller: NonNullable<ListingDetail["seller"]>
}

/** Seller summary. Chat lives only in the main action area, not here. */
export function ListingSellerCard({ seller }: ListingSellerCardProps) {
  const name = seller.shopName?.trim() || "Seller"
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const avatarUrl = getMediaUrl(seller.avatarR2Key)
  const memberSince = formatMemberSince(seller.joinedAt)

  return (
    <Card size="sm">
      <CardContent className="pt-(--card-spacing) space-y-3">
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="h-12 w-12 border border-border/70">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/seller/${seller.id}`}
                className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors truncate"
              >
                {name}
              </Link>
              {seller.isVerified && (
                <ShieldCheck
                  size={16}
                  weight="fill"
                  className="text-primary shrink-0"
                  aria-label="Verified seller"
                />
              )}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              {sellerTypeLabel(seller.sellerType)}
              {seller.isVerified && <span className="text-primary"> · Verified</span>}
            </span>
          </div>
        </div>

        {(memberSince || seller.rating) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
            {memberSince && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarBlank size={14} className="shrink-0" />
                Member since {memberSince}
              </span>
            )}
            {seller.rating && (
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} weight="fill" className="shrink-0 text-accent" />
                <span className="font-semibold text-foreground">{seller.rating.average.toFixed(1)}</span>
                <span>
                  ({seller.rating.count} {seller.rating.count === 1 ? "review" : "reviews"})
                </span>
              </span>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full h-9 text-xs font-semibold rounded-lg justify-between border-border hover:bg-muted"
          render={
            <Link href={`/seller/${seller.id}`}>
              <span>View Store Profile</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          }
        />
      </CardContent>
    </Card>
  )
}
