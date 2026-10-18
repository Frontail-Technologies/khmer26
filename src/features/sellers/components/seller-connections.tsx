"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "@phosphor-icons/react"
import { useSeller } from "../api/sellers.queries"
import { getSellerFollowersPage, getSellerFollowingPage } from "../api/sellers.api"
import { SellerDirectory } from "./seller-directory"

/** A seller's followers or following list, with tabs to switch between them. */
export function SellerConnections({ id, initial }: { id: string; initial: "followers" | "following" }) {
  const t = useTranslations("ui.searchBar")
  const seller = useSeller(id).data
  const base = `/seller/${encodeURIComponent(id)}`

  const tabs = [
    { key: "followers" as const, label: t("followers"), count: seller?.followerCount },
    { key: "following" as const, label: t("following"), count: seller?.followingCount },
  ]

  return (
    <div className="space-y-3">
      <Link href={base} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft size={14} weight="bold" aria-hidden="true" />
        {seller?.shopName ?? t("backToProfile")}
      </Link>

      <nav aria-label={t("followers")} className="grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`${base}/${tab.key}`}
            aria-current={tab.key === initial ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-colors",
              tab.key === initial ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-1.5 opacity-80">{tab.count}</span>}
          </Link>
        ))}
      </nav>

      {initial === "followers" ? (
        <SellerDirectory
          cacheKey={{ kind: "followers", id }}
          fetchPage={(page, limit) => getSellerFollowersPage(id, { page, limit })}
          title={t("followers")}
          emptyText={t("noFollowers")}
        />
      ) : (
        <SellerDirectory
          cacheKey={{ kind: "following", id }}
          fetchPage={(page, limit) => getSellerFollowingPage(id, { page, limit })}
          title={t("following")}
          emptyText={t("noFollowing")}
        />
      )}
    </div>
  )
}
