"use client"

import { useTranslations } from "next-intl"
import { Check, ShareNetwork } from "@phosphor-icons/react"
import { useShareSeller } from "../hooks/use-share-seller"

/** Share icon for the store's mobile top bar (native share sheet, or copies the link). */
export function SellerShareButton({ sellerId, sellerName }: { sellerId: string; sellerName: string }) {
  const tGenerated = useTranslations("generated")
  const { share, copied } = useShareSeller(sellerId, sellerName)
  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? tGenerated("linkCopied") : tGenerated("shareProfile")}
      className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted active:scale-95"
    >
      {copied ? <Check size={20} weight="bold" className="text-primary" /> : <ShareNetwork size={20} weight="bold" />}
    </button>
  )
}
