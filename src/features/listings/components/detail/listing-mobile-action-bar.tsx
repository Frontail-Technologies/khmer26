"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChatCircleDots, Phone } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { FavoriteButton } from "@/features/listings/components/favorite-button"

interface ListingMobileActionBarProps {
  listingId: string
  sellerPhone?: string
  isFavorited?: boolean
}

export function ListingMobileActionBar({
  listingId,
  sellerPhone = "+855 12 889 977",
  isFavorited,
}: ListingMobileActionBarProps) {
  const router = useRouter()
  const [showPhone, setShowPhone] = useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md px-3 sm:px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-lg md:hidden">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        <div className="shrink-0">
          <FavoriteButton
            listingId={listingId}
            initialFavorited={isFavorited}
            className="h-11 w-11 rounded-xl bg-muted/60 hover:bg-muted border border-border/80"
          />
        </div>

        <Button
          variant="outline"
          className="flex-1 h-11 text-xs sm:text-sm font-bold rounded-xl border-border/80 gap-1.5"
          onClick={() => {
            if (showPhone && sellerPhone) {
              window.location.href = `tel:${sellerPhone.replace(/\s+/g, "")}`
            } else {
              setShowPhone(true)
            }
          }}
        >
          <Phone size={17} weight="bold" className="text-primary shrink-0" />
          <span className="truncate">{showPhone ? sellerPhone : "Call"}</span>
        </Button>

        <Button
          className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-xl shadow-xs gap-1.5"
          onClick={() => {
            router.push(`/messages?listingId=${listingId}`)
          }}
        >
          <ChatCircleDots size={19} weight="fill" className="shrink-0" />
          <span className="truncate">Chat</span>
        </Button>
      </div>
    </div>
  )
}
