"use client"

import { useTranslations } from "next-intl"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { marketplaceKeys } from "@/lib/query/keys"
import type { Page } from "@/lib/api/pagination"
import type { SellerSearchResult } from "../api/sellers.api"
import { SellerRow } from "./seller-row"

const PAGE_SIZE = 20

interface SellerDirectoryProps {
  /** Identifies the list in the query cache (kind plus whatever it is filtered by). */
  cacheKey: Record<string, unknown>
  fetchPage: (page: number, limit: number) => Promise<Page<SellerSearchResult>>
  title: string
  emptyText: string
  enabled?: boolean
}

/** A paged list of sellers: search results, followers or following. */
export function SellerDirectory({ cacheKey, fetchPage, title, emptyText, enabled = true }: SellerDirectoryProps) {
  const t = useTranslations("ui.searchBar")
  const query = useInfiniteQuery({
    queryKey: marketplaceKeys.sellers.directory(cacheKey),
    queryFn: ({ pageParam }) => fetchPage(pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    enabled,
    staleTime: 30_000,
  })
  const sellers = query.data?.pages.flatMap((page) => page.items) ?? []

  return (
    <section aria-label={title} className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
      <h2 className="border-b border-border/70 px-4 py-3 text-base font-bold text-foreground">{title}</h2>
      {query.isPending && enabled ? (
        <div className="space-y-2 p-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul>
          {sellers.map((seller) => (
            <SellerRow key={seller.id} seller={seller} />
          ))}
        </ul>
      )}
      {query.hasNextPage && (
        <div className="flex justify-center border-t border-border/70 p-3">
          <Button variant="outline" size="sm" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
            {t("loadMore")}
          </Button>
        </div>
      )}
    </section>
  )
}
