"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import Link from "next/link"
import { ChatCircleDots, CurrencyDollar, PencilSimple, Phone } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import type { ListingDetail } from "../../api/listing-detail.api"
import { useContactReveal } from "../../hooks/use-contact-reveal"
import { useStartConversation } from "../../hooks/use-start-conversation"
import { ListingMakeOfferDialog } from "./listing-make-offer-dialog"

interface ListingMobileActionBarProps {
  listing: Pick<ListingDetail, "id" | "title" | "price" | "currency" | "isOwner">
  /** The seller has public contact numbers: the bar offers Call + Chat instead of Chat + Make Offer. */
  hasContacts: boolean
}

/**
 * Mobile-only floating pill with exactly two actions:
 *  - seller has public numbers: [Call] [Chat]
 *  - otherwise:                 [Chat with Seller] [Make Offer] (offer only when the listing has a price)
 * Call uses the real revealed number, revealing it through the backend first when needed.
 * Save / Share / Report live in the Description card.
 */
export function ListingMobileActionBar({ listing, hasContacts }: ListingMobileActionBarProps) {
  const tGenerated = useTranslations("generated")
  const requireAuth = useRequireAuth()
  const chat = useStartConversation(listing.id)
  const contacts = useContactReveal(listing.id)
  const [offerOpen, setOfferOpen] = useState(false)
  const canOffer = !listing.isOwner && listing.price !== null && listing.currency !== null

  const dial = (value: string) => {
    window.location.href = `tel:${value}`
  }

  const handleCall = async () => {
    const numbers = contacts.revealed ?? (await contacts.revealAsync())
    const first = numbers?.[0]
    if (first) dial(first.value)
  }

  const firstRevealed = contacts.revealed?.[0]
  const pill = "h-11 flex-1 gap-1.5 rounded-full text-sm font-bold shadow-xs"

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-40 md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-1.5 rounded-full border border-border/80 bg-card/95 p-1.5 shadow-lg backdrop-blur-md">
        {listing.isOwner ? (
          <Button
            variant="outline"
            className={pill}
            render={
              <Link href="/account/listings">
                <PencilSimple size={18} weight="bold" />
                <span><LocalizedText id="manageYourListings" /></span>
              </Link>
            }
          />
        ) : hasContacts ? (
          <>
            {firstRevealed ? (
              <Button
                className={`${pill} bg-primary text-primary-foreground hover:bg-primary/90`}
                render={
                  <a href={`tel:${firstRevealed.value}`}>
                    <Phone size={18} weight="fill" />
                    <span><LocalizedText id="call" /></span>
                  </a>
                }
              />
            ) : (
              <Button
                className={`${pill} bg-primary text-primary-foreground hover:bg-primary/90`}
                onClick={() => void handleCall()}
                disabled={contacts.isPending}
              >
                <Phone size={18} weight="fill" />
                <span>{contacts.isPending ? tGenerated("loading") : tGenerated("call")}</span>
              </Button>
            )}
            <Button
              className={`${pill} bg-accent text-accent-foreground hover:bg-accent/90`}
              onClick={chat.start}
              disabled={chat.isPending}
            >
              <ChatCircleDots size={19} weight="fill" className="shrink-0" />
              <span>{chat.isPending ? tGenerated("starting") : tGenerated("chat")}</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              className={`${pill} bg-accent text-accent-foreground hover:bg-accent/90`}
              onClick={chat.start}
              disabled={chat.isPending}
            >
              <ChatCircleDots size={19} weight="fill" className="shrink-0" />
              <span className="truncate">{chat.isPending ? tGenerated("startingChat") : tGenerated("chatWithSeller_8d396e")}</span>
            </Button>

            {canOffer && (
              <Button
                variant="outline"
                className={`${pill} border-border/80`}
                onClick={() => requireAuth(() => setOfferOpen(true))}
              >
                <CurrencyDollar size={18} weight="bold" className="shrink-0 text-primary" />
                <span className="truncate"><LocalizedText id="makeOffer" /></span>
              </Button>
            )}
          </>
        )}
      </div>

      {canOffer && !hasContacts && (
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
