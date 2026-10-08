"use client"

import { useState } from "react"
import {
  ChatCircleDots,
  DotsThreeVertical,
  ShareNetwork,
  Flag,
  Check,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { useStartConversation } from "@/features/listings/hooks/use-start-conversation"
import type { SellerProfile } from "../api/sellers.api"
import { useShareSeller } from "../hooks/use-share-seller"
import { SellerReportDialog } from "./seller-report-dialog"

interface SellerActionsProps {
  seller: SellerProfile
  contactListingId: string | null
  isOwnProfile: boolean
}

export function SellerActions({ seller, contactListingId, isOwnProfile }: SellerActionsProps) {
  const requireAuth = useRequireAuth()
  const [reportOpen, setReportOpen] = useState(false)
  const { share, copied } = useShareSeller(seller.id, seller.shopName)
  // Chat can only be started from a listing; with none there is nothing to talk about.
  const chat = useStartConversation(contactListingId ?? "")
  const canContact = !isOwnProfile && Boolean(contactListingId)

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {canContact && (
          <Button
            className="h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-lg shadow-sm gap-1.5"
            onClick={chat.start}
            disabled={chat.isPending}
          >
            <ChatCircleDots size={18} weight="fill" />
            <span>{chat.isPending ? "Starting chat…" : "Chat with seller"}</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="More seller options"
                className="h-10 w-10 border-border hover:bg-muted"
              >
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={share} className="gap-2 text-xs">
              {copied ? <Check size={16} className="text-primary" /> : <ShareNetwork size={16} />}
              <span>{copied ? "Link copied!" : "Share profile"}</span>
            </DropdownMenuItem>

            {!isOwnProfile && (
              <DropdownMenuItem
                onClick={() => requireAuth(() => setReportOpen(true))}
                className="gap-2 text-xs text-destructive focus:text-destructive"
              >
                <Flag size={16} />
                <span>Report seller</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SellerReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        sellerId={seller.id}
        sellerName={seller.shopName}
      />
    </>
  )
}
