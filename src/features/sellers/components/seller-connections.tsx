"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowLeft } from "@phosphor-icons/react"
import { useSeller } from "../api/sellers.queries"
import { getSellerFollowersPage, getSellerFollowingPage } from "../api/sellers.api"
import { SellerDirectory } from "./seller-directory"
import { MobilePageHeader } from "@/components/shared/mobile-page-header"
import { LinkTabs } from "@/components/shared/link-tabs"

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
    <div className="space-y-1 sm:space-y-3">
      <MobilePageHeader
        backHref={base}
        backLabel={t("backToProfile")}
        title={seller?.shopName}
        className="-mx-3 -mt-4 w-auto sm:-mx-4"
      />
      <Link href={base} className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline md:inline-flex">
        <ArrowLeft size={14} weight="bold" aria-hidden="true" />
        {seller?.shopName ?? t("backToProfile")}
      </Link>

      <LinkTabs
        label={t("followers")}
        className="-mx-3 px-1 sm:mx-0 sm:px-0"
        items={tabs.map((tab) => ({
          href: `${base}/${tab.key}`,
          label: tab.label,
          count: tab.count,
          active: tab.key === initial,
        }))}
      />

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
