import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import { CalendarBlank, SealCheck, Star } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { cn } from "@/lib/utils"
import { formatMemberSince, sellerTypeLabel } from "@/features/listings/lib/listing-detail-format"
import type { SellerProfile } from "../api/sellers.api"
import { sellerInitials } from "../lib/seller-format"
import { useIntlLocale } from "@/lib/i18n/use-intl-locale"
import { SellerActions } from "./seller-actions"
import { SellerContacts } from "./seller-contacts"

interface SellerProfileHeaderProps {
  seller: SellerProfile
  /** First public listing id: the existing chat backend can only start from a listing. */
  contactListingId: string | null
  isOwnProfile: boolean
}

function Stat({ value, label, href }: { value: ReactNode; label: ReactNode; href?: string }) {
  const body = (
    <>
      <span className="block text-base font-extrabold leading-tight text-foreground tabular-nums sm:text-lg">{value}</span>{" "}
      <span className="mt-0.5 block truncate text-2xs font-medium text-muted-foreground sm:text-xs">{label}</span>
    </>
  )
  const className = "min-w-0 flex-1 px-1 py-2.5 text-center"
  return href ? (
    <Link href={href} className={cn(className, "rounded-lg transition-colors hover:bg-muted active:bg-muted")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

/**
 * Store header. On phones it runs edge to edge like a native marketplace profile: cover, overlapping
 * avatar, a stats strip, then full-width actions. From sm up it sits in a card.
 */
export function SellerProfileHeader({ seller, contactListingId, isOwnProfile }: SellerProfileHeaderProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const tSearch = useTranslations("ui.searchBar")
  const intlLocale = useIntlLocale()
  const avatarUrl = getMediaUrl(seller.avatarR2Key)
  const coverUrl = getMediaUrl(seller.coverR2Key)
  const memberSince = formatMemberSince(seller.joinedAt, intlLocale)
  const base = `/seller/${encodeURIComponent(seller.id)}`

  return (
    <section className="-mx-3 overflow-hidden bg-card max-sm:border-b max-sm:border-border/70 sm:mx-0 sm:rounded-2xl sm:border sm:border-border/80 sm:shadow-xs">
      <div data-cover-fallback={coverUrl ? undefined : ""} className="relative h-28 w-full overflow-hidden bg-linear-to-br from-primary/25 via-primary/10 to-accent/15 sm:h-40 md:h-48">
        {coverUrl ? (
          <>
            <Image src={coverUrl} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_85%_20%,var(--color-primary)_0,transparent_40%),radial-gradient(circle_at_10%_120%,var(--color-accent)_0,transparent_35%)] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
        )}
      </div>

      <div className="relative px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="flex items-end justify-between gap-4">
          <Avatar className="-mt-10 size-20 shrink-0 rounded-full border-4 border-card bg-card shadow-md sm:-mt-14 sm:size-28">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={seller.shopName} className="rounded-full object-cover" />}
            <AvatarFallback className="rounded-full bg-primary/10 text-xl font-black text-primary sm:text-2xl">
              {sellerInitials(seller.shopName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-2.5 min-w-0">
          <h1 className="flex min-w-0 items-center gap-1.5 text-xl font-black leading-tight tracking-tight text-foreground sm:text-2xl">
            <span className="wrap-anywhere">{seller.shopName}</span>
            {seller.isVerified && (
              <SealCheck size={20} weight="fill" className="shrink-0 text-primary" aria-label={tGenerated("verifiedSeller")} />
            )}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-foreground/80">
              {sellerTypeLabel(seller.sellerType)}
            </span>
            {seller.isActive && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                <LocalizedText id="activeNow" />
              </span>
            )}
            {memberSince && (
              <span className="inline-flex items-center gap-1">
                <CalendarBlank size={13} className="shrink-0" aria-hidden="true" />
                {tDynamic("memberSince", { date: memberSince })}
              </span>
            )}
          </div>
        </div>

        <div data-seller-stats="" className="mt-4 flex divide-x divide-border/60 rounded-xl border border-border/70 bg-muted/30">
          <Stat value={seller.listingCount} label={<LocalizedText id="listings" />} />
          <Stat value={seller.followerCount} label={tSearch("followers")} href={`${base}/followers`} />
          <Stat value={seller.followingCount} label={tSearch("following")} href={`${base}/following`} />
          <Stat
            value={
              seller.rating ? (
                <span className="inline-flex items-center gap-0.5">
                  {seller.rating.average.toFixed(1)}
                  <Star size={13} weight="fill" className="text-accent" aria-hidden="true" />
                </span>
              ) : (
                "–"
              )
            }
            label={seller.rating ? tDynamic("reviewCount", { count: seller.rating.count }) : <LocalizedText id="rating" />}
          />
        </div>

        {/* One set of actions: under the stats on phones, top-right beside the avatar from sm up. */}
        <div className="mt-4 sm:absolute sm:right-6 sm:top-3 sm:mt-0">
          <SellerActions seller={seller} contactListingId={contactListingId} isOwnProfile={isOwnProfile} />
        </div>

        {seller.contacts.length > 0 && (
          <div className="mt-4">
            <SellerContacts seller={seller} />
          </div>
        )}

        {seller.bio?.trim() && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90 wrap-anywhere">
            {seller.bio.trim()}
          </p>
        )}
      </div>
    </section>
  )
}
