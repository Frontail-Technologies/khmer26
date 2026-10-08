import { ShieldCheck, CalendarBlank, Star, Storefront } from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { formatMemberSince, sellerTypeLabel } from "@/features/listings/lib/listing-detail-format"
import type { SellerProfile } from "../api/sellers.api"
import { pluralize, sellerInitials } from "../lib/seller-format"
import { SellerActions } from "./seller-actions"

interface SellerProfileHeaderProps {
  seller: SellerProfile
  /** First public listing id: the existing chat backend can only start from a listing. */
  contactListingId: string | null
  isOwnProfile: boolean
}

export function SellerProfileHeader({ seller, contactListingId, isOwnProfile }: SellerProfileHeaderProps) {
  const avatarUrl = getMediaUrl(seller.avatarR2Key)
  const memberSince = formatMemberSince(seller.joinedAt)

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="h-28 sm:h-40 md:h-48 w-full bg-linear-to-r from-primary/15 via-primary/5 to-muted" />

      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 min-w-0">
            <div className="-mt-10 sm:-mt-14 shrink-0">
              <Avatar
                className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl border-4 border-card shadow-md bg-card"
              >
                {avatarUrl && (
                  <AvatarImage src={avatarUrl} alt={seller.shopName} className="object-cover rounded-xl" />
                )}
                <AvatarFallback className="font-black text-xl sm:text-2xl bg-primary/10 text-primary rounded-xl">
                  {sellerInitials(seller.shopName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="pt-1 sm:pt-2 pb-1 space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight leading-tight wrap-anywhere">
                  {seller.shopName}
                </h1>
                {seller.isVerified && (
                  <ShieldCheck
                    size={20}
                    weight="fill"
                    className="text-primary shrink-0"
                    aria-label="Verified seller"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5"
                >
                  {sellerTypeLabel(seller.sellerType)}
                </Badge>
                {seller.isVerified && <span className="font-semibold text-primary">Verified</span>}
              </div>
            </div>
          </div>

          <div className="sm:pb-1 shrink-0">
            <SellerActions seller={seller} contactListingId={contactListingId} isOwnProfile={isOwnProfile} />
          </div>
        </div>

        {seller.bio?.trim() && (
          <p className="mt-4 text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line wrap-anywhere">
            {seller.bio.trim()}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 mt-4 border-t border-border/60 text-xs text-muted-foreground">
          {memberSince && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarBlank size={15} className="shrink-0" />
              Member since {memberSince}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Storefront size={15} className="text-primary shrink-0" />
            {pluralize(seller.listingCount, "active listing")}
          </span>
          {seller.rating && (
            <span className="inline-flex items-center gap-1.5">
              <Star size={15} weight="fill" className="text-accent shrink-0" />
              <span className="font-semibold text-foreground">{seller.rating.average.toFixed(1)}</span>
              <span>({pluralize(seller.rating.count, "review")})</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
