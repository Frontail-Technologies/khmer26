"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Eye, Flag, Heart, ImageSquare, MapPin, SealCheck } from "@phosphor-icons/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { StatusBadge } from "@/components/shared/status-badge"
import { ModerationKeywordNotice } from "@/features/content/components/moderation-keyword-notice"
import type { AdminListing } from "../types"
import { ListingRowActions } from "./listing-row-actions"

function price(listing: AdminListing) {
  return listing.currency === "USD"
    ? `$${listing.price.toLocaleString("en-US")}`
    : `${listing.price.toLocaleString("en-US")} ៛`
}

/**
 * Side panel opened from a listings row: photos, key facts and the decision buttons, so a listing
 * can be checked and approved/rejected without leaving the table.
 */
export function ListingQuickView({
  listing,
  onOpenChange,
}: {
  listing: AdminListing | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={Boolean(listing)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        {listing && (
          <>
            <SheetHeader className="border-b border-border/60 px-5 py-4">
              <div className="flex items-center gap-2 pr-8">
                <StatusBadge label={listing.status} size="sm" />
                <span className="font-mono text-2xs text-muted-foreground">{listing.displayId}</span>
              </div>
              <SheetTitle className="text-base font-bold leading-snug">{listing.title}</SheetTitle>
              <p className="text-xl font-extrabold tabular-nums text-primary">{price(listing)}</p>
            </SheetHeader>

            <div className="space-y-4 px-5 py-4">
              {listing.images.length > 0 ? (
                <div className="scroll-rail -mx-5 flex gap-2 px-5">
                  {listing.images.slice(0, 8).map((image) => (
                    <div key={image.id} className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image src={image.url} alt={image.alt ?? listing.title} fill sizes="112px" className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <ImageSquare size={28} />
                </div>
              )}

              {listing.status === "pending" && <ModerationKeywordNotice matches={listing.moderationMatches ?? []} />}

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Seller</dt>
                  <dd className="flex items-center gap-1 font-semibold text-foreground">
                    <span className="truncate">{listing.seller.name}</span>
                    {listing.seller.verified && <SealCheck size={14} weight="fill" className="shrink-0 text-primary" />}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="truncate font-semibold text-foreground">{listing.categoryName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="flex items-center gap-1 truncate font-semibold text-foreground">
                    <MapPin size={13} className="shrink-0" />
                    {listing.location.province}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Submitted</dt>
                  <dd className="font-semibold text-foreground">{listing.createdDate}</dd>
                </div>
              </dl>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Eye size={14} />{listing.viewCount}</span>
                <span className="inline-flex items-center gap-1"><Heart size={14} />{listing.favoriteCount}</span>
                {listing.reports.length > 0 && (
                  <span className="inline-flex items-center gap-1 font-semibold text-destructive">
                    <Flag size={14} weight="fill" />
                    {listing.reports.length}
                  </span>
                )}
              </div>

              {listing.description && (
                <p className="line-clamp-6 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{listing.description}</p>
              )}
            </div>

            <div className="sticky bottom-0 mt-auto space-y-2 border-t border-border/60 bg-card/95 px-5 py-3 backdrop-blur">
              <ListingRowActions listing={listing} layout="card" />
              <Link
                href={`/listings/${listing.id}`}
                className="flex items-center justify-center gap-1 py-1 text-xs font-semibold text-primary"
              >
                Full details
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
