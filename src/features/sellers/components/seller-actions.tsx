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
      <div className="flex w-full items-center gap-2 sm:w-auto">
        {canContact && (
          <Button
            className="h-11 flex-1 gap-1.5 rounded-xl bg-accent px-4 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 sm:h-10 sm:flex-none sm:rounded-lg"
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
            className={`h-11 flex-1 gap-1.5 rounded-xl px-3.5 text-sm font-semibold sm:h-10 sm:flex-none sm:rounded-lg ${
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
                className="size-11 shrink-0 rounded-xl border-border hover:bg-muted sm:size-10 sm:rounded-lg"
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
