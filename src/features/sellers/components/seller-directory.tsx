"use client"

import { useTranslations } from "next-intl"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersThree } from "@phosphor-icons/react"
import { EmptyState } from "@/components/shared/EmptyState"
import { marketplaceKeys } from "@/lib/query/keys"
import type { Page } from "@/lib/api/pagination"
import type { SellerSearchResult } from "../api/sellers.api"
import { SellerRow } from "./seller-row"

const PAGE_SIZE = 20

interface SellerDirectoryProps {
  /** Identifies the list in the query cache (kind plus whatever it is filtered by). */
  cacheKey: Record<string, unknown>
  fetchPage: (page: number, limit: number) => Promise<Page<SellerSearchResult>>
  /** Accessible name of the list (the tab bar above shows it visually). */
  title: string
  emptyText: string
  emptyDescription?: string
  enabled?: boolean
}

/** A paged list of sellers: search results, followers or following. */
export function SellerDirectory({ cacheKey, fetchPage, title, emptyText, emptyDescription, enabled = true }: SellerDirectoryProps) {
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
    <section aria-label={title} className="sm:overflow-hidden sm:rounded-xl sm:border sm:border-border/80 sm:bg-card sm:shadow-2xs">
      {query.isPending && enabled ? (
        <div className="divide-y divide-border/60" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 sm:px-4">
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <EmptyState
          icon={<UsersThree size={28} />}
          title={emptyText}
          description={emptyDescription}
          className="py-14"
        />
      ) : (
        <ul className="divide-y divide-border/60">
          {sellers.map((seller) => (
            <SellerRow key={seller.id} seller={seller} />
          ))}
        </ul>
      )}
      {query.hasNextPage && (
        <div className="flex justify-center border-t border-border/60 py-3">
          <Button variant="outline" size="sm" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
            {t("loadMore")}
          </Button>
        </div>
      )}
    </section>
  )
}
