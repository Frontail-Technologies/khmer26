"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import Link from "next/link"
import { useState } from "react"
import { ChatCircleDots, CurrencyDollar, Globe, ShieldCheck, Star, UserCheck, UserPlus } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { SITE } from "@/lib/constants/site"
import { getMediaUrl } from "@/lib/media/get-media-url"
import type { ListingDetail } from "../../api/listing-detail.api"
import { useFollowSeller } from "../../hooks/use-follow-seller"
import { useStartConversation } from "../../hooks/use-start-conversation"
import { formatMemberSince, sellerTypeLabel } from "../../lib/listing-detail-format"
import { useIntlLocale } from "@/lib/i18n/use-intl-locale"
import { ListingContactNumbers } from "./listing-contact-numbers"
import { ListingMakeOfferDialog } from "./listing-make-offer-dialog"

interface ListingSellerCardProps {
  seller: NonNullable<ListingDetail["seller"]>
  listingId: string
  isOwner: boolean
  /**
   * Mobile only: when the sticky bar shows Call + Chat it has no room for Make Offer, so the offer
   * action lives here instead (never in both places).
   */
  mobileOffer?: { title: string; price: number; currency: "USD" | "KHR" } | null
}

/** Product-style host for the profile URL row (the real link still uses the current origin). */
function siteHost(): string {
  try {
    return new URL(SITE.url).host
  } catch {
    return "khmer26.com"
  }
}

/**
 * Seller summary in the Khmer24 sidebar structure: coloured header with Follow, store URL,
 * masked contact numbers, divider, one Chat button. Nothing here is invented: there is no
 * @username line because sellers have no handle yet.
 */
export function ListingSellerCard({ seller, listingId, isOwner, mobileOffer = null }: ListingSellerCardProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const intlLocale = useIntlLocale()
  const requireAuth = useRequireAuth()
  const [offerOpen, setOfferOpen] = useState(false)
  const chat = useStartConversation(listingId)
  const follow = useFollowSeller(seller.id)

  const name = seller.shopName?.trim() || "Seller"
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => Array.from(w)[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const avatarUrl = getMediaUrl(seller.avatarR2Key)
  const memberSince = formatMemberSince(seller.joinedAt, intlLocale)
  const profilePath = seller.id ? `/seller/${encodeURIComponent(seller.id)}` : null

  return (
    <Card size="sm" className="gap-0 overflow-hidden rounded-md p-0">
      <div className="flex items-start gap-2.5 bg-primary px-3 py-2.5 text-primary-foreground md:gap-3 md:px-3.5 md:py-3">
        <Avatar className="h-10 w-10 shrink-0 border-2 border-white/80 bg-white md:h-12 md:w-12">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-white text-sm font-bold text-primary">{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {profilePath ? (
              <Link href={profilePath} className="truncate text-base font-bold leading-tight hover:underline">
                {name}
              </Link>
            ) : (
              <span className="truncate text-base font-bold leading-tight">{name}</span>
            )}
            {seller.isVerified && (
              <ShieldCheck size={15} weight="fill" className="shrink-0" aria-label={tGenerated("verifiedSeller")} />
            )}
          </div>
          <span className="flex flex-wrap items-center gap-x-2 text-xxs text-primary-foreground/85">
            <span>{sellerTypeLabel(seller.sellerType)}</span>
            {seller.isActive && (
              <span className="inline-flex items-center gap-1 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                <LocalizedText id="activeNow" />
              </span>
            )}
            {seller.rating && (
              <span className="inline-flex items-center gap-1">
                <Star size={11} weight="fill" />
                <span className="font-semibold">{seller.rating.average.toFixed(1)}</span>
                <span>
                  ({seller.rating.count} {seller.rating.count === 1 ? "review" : "reviews"})
                </span>
              </span>
            )}
          </span>
          {memberSince && (
            <span className="block text-xxs text-primary-foreground/85">
              {tDynamic("memberSince", { date: memberSince })}
            </span>
          )}
        </div>

        {!isOwner && seller.allowBuyersFollow && (
          <Button
            size="sm"
            variant="secondary"
            className="h-7 shrink-0 gap-1 rounded-sm bg-white px-2.5 text-xs font-semibold text-neutral-900 hover:bg-white/90"
            onClick={() => follow.toggle(seller.isFollowing)}
            disabled={follow.isPending}
            aria-pressed={seller.isFollowing}
          >
            {seller.isFollowing ? (
              <>
                <UserCheck size={14} weight="bold" className="text-primary" />
                <span><LocalizedText id="following" /></span>
              </>
            ) : (
              <>
                <UserPlus size={14} weight="bold" />
                <span><LocalizedText id="follow" /></span>
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2 px-3 py-2.5 md:space-y-2.5 md:px-3.5 md:py-3">
        {profilePath && (
          <Link
            href={profilePath}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
            aria-label={`Seller profile ${siteHost()}${profilePath}`}
          >
            <Globe size={16} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{`${siteHost()}${profilePath}`}</span>
          </Link>
        )}

        {seller.contacts.length > 0 && (
          <div className="border-t border-border/60 pt-2.5">
            <ListingContactNumbers listingId={listingId} contacts={seller.contacts} />
          </div>
        )}

        {mobileOffer && !isOwner && (
          <div className="border-t border-border/60 pt-2 md:hidden">
            <Button
              variant="outline"
              className="h-9 w-full gap-1.5 rounded-md text-sm font-semibold"
              onClick={() => requireAuth(() => setOfferOpen(true))}
            >
              <CurrencyDollar size={16} weight="bold" className="text-primary" />
              <span><LocalizedText id="makeOffer" /></span>
            </Button>
            <ListingMakeOfferDialog
              open={offerOpen}
              onOpenChange={setOfferOpen}
              listingId={listingId}
              listingTitle={mobileOffer.title}
              askingPrice={mobileOffer.price}
              currency={mobileOffer.currency}
            />
          </div>
        )}

        {/* On mobile the sticky action bar carries chat. */}
        {!isOwner && (
          <div className="hidden border-t border-border/60 pt-2.5 md:block">
            <Button
              className="h-10 w-full gap-2 rounded-md bg-accent text-sm font-bold text-accent-foreground shadow-xs hover:bg-accent/90"
              onClick={chat.start}
              disabled={chat.isPending}
            >
              <ChatCircleDots size={19} weight="fill" />
              <span>{chat.isPending ? tGenerated("startingChat") : tGenerated("chat")}</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
