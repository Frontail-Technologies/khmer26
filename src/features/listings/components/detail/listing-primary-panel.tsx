"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChatCircleDots,
  CurrencyDollar,
  ShareNetwork,
  Flag,
  MapPin,
  Clock,
  Eye,
  Check,
  PencilSimple,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FavoriteButton } from "@/features/listings/components/favorite-button"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { formatRelativeTime } from "@/lib/formatters/date"
import type { ListingDetail } from "../../api/listing-detail.api"
import { useShareListing } from "../../hooks/use-share-listing"
import { useStartConversation } from "../../hooks/use-start-conversation"
import { formatListingPrice, formatLocation } from "../../lib/listing-detail-format"
import { ListingReportDialog } from "./listing-report-dialog"
import { ListingMakeOfferDialog } from "./listing-make-offer-dialog"

interface ListingPrimaryPanelProps {
  listing: ListingDetail
}

export function ListingPrimaryPanel({ listing }: ListingPrimaryPanelProps) {
  const requireAuth = useRequireAuth()
  const { share, copied } = useShareListing(listing.id, listing.title)
  const chat = useStartConversation(listing.id)
  const [reportOpen, setReportOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)

  const canOffer = !listing.isOwner && listing.price !== null && listing.currency !== null
  const actionClass =
    "flex h-10 items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

  return (
    <>
      <Card size="sm">
        <CardContent className="pt-(--card-spacing) space-y-3">
          <div className="space-y-1">
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-primary">
              {formatListingPrice(listing)}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-foreground leading-snug wrap-break-word">
              {listing.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium">
              <MapPin size={14} className="text-primary shrink-0" />
              <span>{formatLocation(listing.location)}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} className="shrink-0" />
              <span>{formatRelativeTime(listing.createdAt)}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={14} className="shrink-0" />
              <span>
                {listing.views.toLocaleString()} {listing.views === 1 ? "view" : "views"}
              </span>
            </span>
          </div>

          {listing.isOwner && listing.moderationStatus && listing.moderationStatus !== "approved" && (
            <p className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
              {listing.moderationStatus === "pending_review"
                ? "Your listing is pending review and is not public yet."
                : "Your listing was rejected and is not public."}
            </p>
          )}

          {/* On mobile the sticky bar carries these actions. */}
          <div className="hidden space-y-2 border-t border-border/60 pt-3 md:block">
            {listing.isOwner ? (
              <Button
                variant="outline"
                className="w-full h-11 font-bold text-sm rounded-lg gap-2"
                render={
                  <Link href="/account/listings">
                    <PencilSimple size={18} weight="bold" />
                    <span>Manage your listings</span>
                  </Link>
                }
              />
            ) : (
              <>
                <Button
                  className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm rounded-lg shadow-sm gap-2"
                  onClick={chat.start}
                  disabled={chat.isPending}
                >
                  <ChatCircleDots size={20} weight="fill" />
                  <span>{chat.isPending ? "Starting chat…" : "Chat with Seller"}</span>
                </Button>

                {canOffer && (
                  <Button
                    variant="outline"
                    className="w-full h-10 text-sm font-semibold rounded-lg gap-1.5 border-border hover:bg-muted"
                    onClick={() => requireAuth(() => setOfferOpen(true))}
                  >
                    <CurrencyDollar size={16} weight="bold" />
                    <span>Make Offer</span>
                  </Button>
                )}
              </>
            )}
          </div>

          <div
            className={`grid divide-x divide-border/60 overflow-hidden rounded-lg border border-border/60 ${
              listing.isOwner ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {!listing.isOwner && (
              <FavoriteButton
                listingId={listing.id}
                initialFavorited={listing.isFavorited}
                showLabel
                className="h-10 text-muted-foreground hover:bg-muted hover:text-foreground"
              />
            )}
            <button type="button" onClick={() => void share()} className={actionClass}>
              {copied ? <Check size={17} className="text-primary" /> : <ShareNetwork size={17} />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
            {!listing.isOwner && (
              <button
                type="button"
                onClick={() => requireAuth(() => setReportOpen(true))}
                className={`${actionClass} hover:text-destructive`}
              >
                <Flag size={17} />
                <span>Report</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {!listing.isOwner && (
        <ListingReportDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          listingId={listing.id}
          listingTitle={listing.title}
        />
      )}

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
