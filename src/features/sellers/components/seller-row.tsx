"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { CaretRight, SealCheck } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMediaUrl } from "@/lib/media/get-media-url"
import type { SellerSearchResult } from "../api/sellers.api"

/** One seller in a result or follower list. */
export function SellerRow({ seller }: { seller: SellerSearchResult }) {
  const t = useTranslations("ui.searchBar")
  const avatar = getMediaUrl(seller.avatarR2Key)
  return (
    <li>
      <Link
        href={`/seller/${encodeURIComponent(seller.id)}`}
        className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/60 active:bg-muted sm:px-4"
      >
        <Avatar className="size-12">
          {avatar && <AvatarImage src={avatar} alt="" />}
          <AvatarFallback>{seller.shopName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
            <span className="truncate">{seller.shopName}</span>
            {seller.isVerified && <SealCheck size={14} weight="fill" className="shrink-0 text-primary" aria-hidden="true" />}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {seller.username ? `@${seller.username} · ` : ""}
            {t("followersCount", { count: seller.followerCount })} · {t("adsCount", { count: seller.listingCount })}
          </p>
        </div>
        <CaretRight size={16} className="shrink-0 text-muted-foreground/70" aria-hidden="true" />
      </Link>
    </li>
  )
}
