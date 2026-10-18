"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { searchSellersPage } from "@/features/sellers/api/sellers.api"
import { SellerRow } from "@/features/sellers/components/seller-row"
import { SearchTabs } from "./search-tabs"

const PREVIEW_SIZE = 3

function useSellerPreview(q: string, group: "user" | "company") {
  const term = q.trim()
  return useQuery({
    queryKey: marketplaceKeys.search.suggestions({ q: term, kind: "sellers", group }),
    queryFn: () => searchSellersPage(term, group, { page: 1, limit: PREVIEW_SIZE }),
    enabled: term.length >= 2,
    staleTime: 30_000,
  }).data
}

function PreviewGroup({
  title,
  empty,
  href,
  page,
}: {
  title: string
  empty: string
  href: string
  page: ReturnType<typeof useSellerPreview>
}) {
  const t = useTranslations("ui.searchBar")
  const sellers = page?.items ?? []
  return (
    <section aria-label={title} className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {(page?.pagination.total ?? 0) > PREVIEW_SIZE && (
          <Link href={href} className="text-xs font-semibold text-primary hover:underline">
            {t("seeAll")}
          </Link>
        )}
      </div>
      {sellers.length === 0 ? (
        <p className="px-4 py-5 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul>
          {sellers.map((seller) => (
            <SellerRow key={seller.id} seller={seller} />
          ))}
        </ul>
      )}
    </section>
  )
}

/** Overview shown on the keyword search page: a few users and companies, with links to the full lists. */
export function SellerResults({ q }: { q: string }) {
  const t = useTranslations("ui.searchBar")
  const users = useSellerPreview(q, "user")
  const companies = useSellerPreview(q, "company")
  const query = encodeURIComponent(q)

  return (
    <div className="mb-4 space-y-3">
      <SearchTabs q={q} />
      <PreviewGroup title={t("users")} empty={t("noUsers")} href={`/search/users?q=${query}`} page={users} />
      <PreviewGroup title={t("companies")} empty={t("noCompanies")} href={`/search/companies?q=${query}`} page={companies} />
    </div>
  )
}
