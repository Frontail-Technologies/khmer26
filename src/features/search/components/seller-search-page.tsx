"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { searchSellersPage } from "@/features/sellers/api/sellers.api"
import { SellerDirectory } from "@/features/sellers/components/seller-directory"
import { SearchTabs } from "./search-tabs"

/** Full paged list of users or companies matching ?q=, under the shared tabs. */
export function SellerSearchPage({ group }: { group: "user" | "company" }) {
  const t = useTranslations("ui.searchBar")
  const q = (useSearchParams().get("q") ?? "").trim()

  return (
    <div className="space-y-3">
      <SearchTabs q={q} />
      <SellerDirectory
        cacheKey={{ kind: "search", group, q }}
        fetchPage={(page, limit) => searchSellersPage(q, group, { page, limit })}
        title={group === "user" ? t("users") : t("companies")}
        emptyText={group === "user" ? t("noUsers") : t("noCompanies")}
        enabled={q.length >= 2}
      />
    </div>
  )
}
