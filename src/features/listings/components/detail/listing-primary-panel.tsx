"use client"

import { useLocale, useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import Link from "next/link"
import { CurrencyDollar, MapPin, Clock, Eye, PencilSimple } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { formatRelativeTime } from "@/lib/formatters/date"
import type { ListingDetail } from "../../api/listing-detail.api"
import { formatListingPrice, formatLocation } from "../../lib/listing-detail-format"
import { ListingMakeOfferDialog } from "./listing-make-offer-dialog"

interface ListingPrimaryPanelProps {
  listing: ListingDetail
}

/**
 * Title, metadata and price: the text part of the top listing card. Make Offer sits right next to
 * the price on desktop; on mobile the sticky bar carries it. Chat lives in the seller card.
 */
export function ListingPrimaryPanel({ listing }: ListingPrimaryPanelProps) {
  const tGenerated = useTranslations("generated")
  const locale = useLocale()
  const requireAuth = useRequireAuth()
  const [offerOpen, setOfferOpen] = useState(false)
  const canOffer = !listing.isOwner && listing.price !== null && listing.currency !== null

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-lg font-bold leading-snug text-foreground wrap-break-word">{listing.title}</h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="shrink-0 text-primary" />
            <span>{formatLocation(listing.location, locale)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="shrink-0" />
            <span>{formatRelativeTime(listing.createdAt)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye size={13} className="shrink-0" />
            <span>
              {listing.views.toLocaleString()} {listing.views === 1 ? "view" : "views"}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
          <span className="text-xl font-black tracking-tight text-primary">{formatListingPrice(listing)}</span>

          {listing.isOwner ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden h-8 gap-1.5 rounded-md text-xs font-semibold md:inline-flex"
              render={
                <Link href="/account/listings">
                  <PencilSimple size={14} weight="bold" />
                  <span><LocalizedText id="manageYourListings" /></span>
                </Link>
              }
            />
          ) : (
            canOffer && (
              <Button
                variant="outline"
                size="sm"
                className="hidden h-8 gap-1.5 rounded-md border-border text-xs font-semibold hover:bg-muted md:inline-flex"
                onClick={() => requireAuth(() => setOfferOpen(true))}
              >
                <CurrencyDollar size={14} weight="bold" />
                <span><LocalizedText id="makeOffer" /></span>
              </Button>
            )
          )}
        </div>

        {listing.isOwner && listing.moderationStatus && listing.moderationStatus !== "approved" && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
            {listing.moderationStatus === "pending_review"
              ? tGenerated("yourListingIsPendingReviewAndIsNotPublic")
              : tGenerated("yourListingWasRejectedAndIsNotPublic")}
          </p>
        )}
      </div>

      {canOffer && (
        <ListingMakeOfferDialog
          open={offerOpen}
          onOpenChange={setOfferOpen}
          listingId={listing.id}
          listingTitle={listing.title}
          askingPrice={Number(listing.price)}
          currency={listing.currency!}
        />
      )}
    </>
  )
}
