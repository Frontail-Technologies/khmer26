"use client"

import { useTranslations } from "next-intl"

import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ShareNetwork } from "@phosphor-icons/react"
import { FavoriteButton } from "@/features/listings/components/favorite-button"
import type { ListingDetail } from "../../api/listing-detail.api"
import { useShareListing } from "../../hooks/use-share-listing"

const circle =
  "flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-xs transition-colors hover:bg-black/65 active:scale-95"

interface ListingMobileGalleryControlsProps {
  listing: Pick<ListingDetail, "id" | "title" | "isFavorited" | "isOwner">
  /** Where Back goes when there is no browser history to return to (e.g. the listing was opened directly). */
  fallbackHref: string
}

/**
 * Immersive mobile top: Back at the top-left, Save and Share at the top-right, all over the
 * gallery image. Mobile only; desktop keeps the normal navbar and the Description action row.
 */
export function ListingMobileGalleryControls({ listing, fallbackHref }: ListingMobileGalleryControlsProps) {
  const tGenerated = useTranslations("generated")
  const router = useRouter()
  const { share, copied } = useShareListing(listing.id, listing.title)

  const goBack = () => {
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-2 md:hidden"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button type="button" onClick={goBack} aria-label={tGenerated("back")} className={`pointer-events-auto ${circle}`}>
        <ArrowLeft size={20} weight="bold" />
      </button>

      <div className="pointer-events-auto flex items-center gap-2">
        {!listing.isOwner && (
          <FavoriteButton listingId={listing.id} initialFavorited={listing.isFavorited} className="h-9 w-9" />
        )}
        <button type="button" onClick={() => void share()} aria-label={tGenerated("share")} className={circle}>
          {copied ? <Check size={18} weight="bold" /> : <ShareNetwork size={18} weight="bold" />}
        </button>
      </div>
    </div>
  )
}
