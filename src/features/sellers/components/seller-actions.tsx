"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import {
  ChatCircleDots,
  DotsThreeVertical,
  ShareNetwork,
  Flag,
  Check,
  UserCheck,
  UserPlus,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { useFollowSeller } from "@/features/listings/hooks/use-follow-seller"
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
  const tGenerated = useTranslations("generated")
  const requireAuth = useRequireAuth()
  const [reportOpen, setReportOpen] = useState(false)
  const { share, copied } = useShareSeller(seller.id, seller.shopName)
  // Chat can only be started from a listing; with none there is nothing to talk about.
  const chat = useStartConversation(contactListingId ?? "")
  const follow = useFollowSeller(seller.id)
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
            <span>{chat.isPending ? tGenerated("startingChat") : tGenerated("chatWithSeller")}</span>
          </Button>
        )}

        {!isOwnProfile && seller.allowBuyersFollow && (
          <Button
            variant={seller.isFollowing ? "outline" : "secondary"}
            className={`h-10 gap-1.5 rounded-lg px-3.5 text-xs font-semibold sm:text-sm ${
              seller.isFollowing ? "border-primary text-primary hover:bg-primary/5" : ""
            }`}
            onClick={() => follow.toggle(seller.isFollowing)}
            disabled={follow.isPending}
            aria-pressed={seller.isFollowing}
          >
            {seller.isFollowing ? (
              <>
                <UserCheck size={16} weight="bold" />
                <span><LocalizedText id="following" /></span>
              </>
            ) : (
              <>
                <UserPlus size={16} weight="bold" />
                <span><LocalizedText id="follow" /></span>
              </>
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={tGenerated("moreSellerOptions")}
                className="h-10 w-10 border-border hover:bg-muted"
              >
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={share} className="gap-2 text-xs">
              {copied ? <Check size={16} className="text-primary" /> : <ShareNetwork size={16} />}
              <span>{copied ? tGenerated("linkCopied") : tGenerated("shareProfile")}</span>
            </DropdownMenuItem>

            {!isOwnProfile && (
              <DropdownMenuItem
                onClick={() => requireAuth(() => setReportOpen(true))}
                className="gap-2 text-xs text-destructive focus:text-destructive"
              >
                <Flag size={16} />
                <span><LocalizedText id="reportSeller" /></span>
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
