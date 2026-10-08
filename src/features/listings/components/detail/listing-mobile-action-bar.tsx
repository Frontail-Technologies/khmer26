"use client"

import { useState } from "react"
import Link from "next/link"
import { ChatCircleDots, CurrencyDollar, PencilSimple } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import type { ListingDetail } from "../../api/listing-detail.api"
import { useStartConversation } from "../../hooks/use-start-conversation"
import { ListingMakeOfferDialog } from "./listing-make-offer-dialog"

interface ListingMobileActionBarProps {
  listing: Pick<ListingDetail, "id" | "title" | "price" | "currency" | "isOwner">
}

/** Mobile-only sticky actions. Favorite, share and report live in the main action card. */
export function ListingMobileActionBar({ listing }: ListingMobileActionBarProps) {
  const requireAuth = useRequireAuth()
  const chat = useStartConversation(listing.id)
  const [offerOpen, setOfferOpen] = useState(false)
  const canOffer = !listing.isOwner && listing.price !== null && listing.currency !== null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md px-3 sm:px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-lg md:hidden">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        {listing.isOwner ? (
          <Button
            variant="outline"
            className="flex-1 h-11 text-xs sm:text-sm font-bold rounded-xl gap-1.5"
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
              className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-xl shadow-xs gap-1.5"
              onClick={chat.start}
              disabled={chat.isPending}
            >
              <ChatCircleDots size={19} weight="fill" className="shrink-0" />
              <span className="truncate">{chat.isPending ? "Starting chat…" : "Chat with Seller"}</span>
            </Button>

            {canOffer && (
              <Button
                variant="outline"
                className="flex-1 h-11 text-xs sm:text-sm font-bold rounded-xl border-border/80 gap-1.5"
                onClick={() => requireAuth(() => setOfferOpen(true))}
              >
                <CurrencyDollar size={18} weight="bold" className="shrink-0 text-primary" />
                <span className="truncate">Make Offer</span>
              </Button>
            )}
          </>
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
    </div>
  )
}
