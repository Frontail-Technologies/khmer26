"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChatCircleDots, Phone } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface ListingMobileActionBarProps {
  listingId: string
  sellerPhone?: string
}

export function ListingMobileActionBar({
  listingId,
  sellerPhone = "+855 12 889 977",
}: ListingMobileActionBarProps) {
  const router = useRouter()
  const [showPhone, setShowPhone] = useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md px-4 py-2.5 shadow-lg md:hidden">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1 h-11 text-xs sm:text-sm font-bold rounded-lg border-border"
          onClick={() => setShowPhone((prev) => !prev)}
        >
          <Phone size={16} weight="bold" className="mr-1 text-primary" />
          <span>{showPhone ? sellerPhone : "Call Seller"}</span>
        </Button>

        <Button
          className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-lg shadow-sm"
          onClick={() => {
            router.push(`/messages?listingId=${listingId}`)
          }}
        >
          <ChatCircleDots size={18} weight="fill" className="mr-1" />
          <span>Chat with Seller</span>
        </Button>
      </div>
      <div className="h-safe-area-inset-bottom bg-transparent" />
    </div>
  )
}
