"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { SealCheck } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { marketplaceKeys } from "@/lib/query/keys"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { searchSellers, type SellerSearchResult } from "@/features/sellers/api/sellers.api"

const RESULT_LIMIT = 10

function useSellerGroup(q: string, group: "user" | "company") {
  const enabled = q.trim().length >= 2
  return useQuery({
    queryKey: marketplaceKeys.search.suggestions({ q: q.trim(), kind: "sellers", group }),
    queryFn: () => searchSellers(q.trim(), { group, limit: RESULT_LIMIT }),
    enabled,
    staleTime: 30_000,
  }).data ?? []
}

function SellerRow({ seller }: { seller: SellerSearchResult }) {
  const t = useTranslations("ui.searchBar")
  const avatar = getMediaUrl(seller.avatarR2Key)
  return (
    <li>
      <Link
        href={`/seller/${encodeURIComponent(seller.id)}`}
        className="flex items-center gap-3 border-b border-border/70 px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/60"
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
            {t("adsCount", { count: seller.listingCount })}
          </p>
        </div>
      </Link>
    </li>
  )
}

function Group({ id, title, sellers, empty }: { id: string; title: string; sellers: SellerSearchResult[]; empty: string }) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-32 overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
      <h2 className="border-b border-border/70 px-4 py-3 text-base font-bold text-foreground">{title}</h2>
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

/** Users and companies matching a keyword search, plus tabs that jump between the result groups. */
export function SellerResults({ q }: { q: string }) {
  const t = useTranslations("ui.searchBar")
  const users = useSellerGroup(q, "user")
  const companies = useSellerGroup(q, "company")
  const tabs = [
    { href: "#users", label: t("users") },
    { href: "#companies", label: t("companies") },
    { href: "#posts", label: t("posts") },
  ]

  return (
    <div className="mb-4 space-y-3">
      <nav aria-label={t("sellers")} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {tab.label}
          </a>
        ))}
      </nav>
      <Group id="users" title={t("users")} sellers={users} empty={t("noUsers")} />
      <Group id="companies" title={t("companies")} sellers={companies} empty={t("noCompanies")} />
    </div>
  )
}
