"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { ShareFat, Warning, Check } from "@phosphor-icons/react"
import { FavoriteButton } from "@/features/listings/components/favorite-button"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import type { ListingDetail } from "../../api/listing-detail.api"
import { useShareListing } from "../../hooks/use-share-listing"
import { ListingReportDialog } from "./listing-report-dialog"

/** The one and only Save / Share / Report row on the page. */
export function ListingActionRow({ listing }: { listing: ListingDetail }) {
  const tGenerated = useTranslations("generated")
  const requireAuth = useRequireAuth()
  const { share, copied } = useShareListing(listing.id, listing.title)
  const [reportOpen, setReportOpen] = useState(false)
  const actionClass =
    "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-muted text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"

  return (
    <>
      <div
        className={`grid gap-2 sm:gap-3 ${listing.isOwner ? "grid-cols-1 max-md:hidden" : "grid-cols-1 md:grid-cols-3"}`}
      >
        {!listing.isOwner && (
          <FavoriteButton
            listingId={listing.id}
            initialFavorited={listing.isFavorited}
            showLabel
            icon="bookmark"
            className={`${actionClass} max-md:hidden`}
          />
        )}
        {!listing.isOwner && (
          <button
            type="button"
            onClick={() => requireAuth(() => setReportOpen(true))}
            className={actionClass}
          >
            <Warning size={19} />
            <span><LocalizedText id="report" /></span>
          </button>
        )}
        <button type="button" onClick={() => void share()} className={`${actionClass} max-md:hidden`}>
          {copied ? <Check size={19} className="text-primary" /> : <ShareFat size={19} />}
          <span>{copied ? tGenerated("copied") : tGenerated("share")}</span>
        </button>
      </div>

      {!listing.isOwner && (
        <ListingReportDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          listingId={listing.id}
          listingTitle={listing.title}
        />
      )}
    </>
  )
}
