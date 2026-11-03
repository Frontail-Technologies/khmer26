"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useDeferredValue, useMemo, useState } from "react"
import { ArrowsDownUp, Funnel, Heart, MagnifyingGlass } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/shared/EmptyState"
import { AccountPageHeader } from "../../components/account-page-header"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { ListingListRow } from "@/features/listings/components/listing-list-row"
import { ListingViewToggle } from "@/features/listings/components/listing-view-toggle"
import { useListingViewMode } from "@/features/listings/hooks/use-listing-view-mode"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import { useCategoryTree } from "@/features/categories/api/categories.queries"
import type { CategoryNode } from "@/features/categories/api/categories.api"
import { useFavorites } from "../api/favorites.queries"
import { useLocalizedName } from "@/lib/i18n/localized"

export type FavoriteSortOption = "recent" | "newest" | "price_asc" | "price_desc"

function flattenCategories(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)])
}

export function AccountFavoritesView() {
  const getLocalizedName = useLocalizedName()
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const [viewMode, setViewMode] = useListingViewMode()
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearch = useDeferredValue(searchQuery.trim())
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortOption, setSortOption] = useState<FavoriteSortOption>("recent")
  const [page, setPage] = useState(1)
  const categoriesQuery = useCategoryTree()
  const categories = useMemo(() => flattenCategories(categoriesQuery.data ?? []), [categoriesQuery.data])
  const favorites = useFavorites({
    page,
    q: deferredSearch || undefined,
    categoryId: categoryFilter === "all" ? undefined : categoryFilter,
    sort: sortOption,
  })
  // Everything on this page is saved by definition: show the filled heart even if the DTO omits the flag.
  const cards = useMemo(() => (favorites.data?.items ?? []).map((item) => ({ ...toListingCardData(item), isFavorited: true })), [favorites.data?.items])
  const pagination = favorites.data?.pagination
  const hasFilters = Boolean(searchQuery.trim()) || categoryFilter !== "all"

  return (
    <div className="space-y-4 lg:space-y-6">
      <AccountPageHeader title={tGenerated("savedListings_635379")} />

      <div className="space-y-4">
        {/* Phones: search + view toggle on one row, the two filters on the next at half width each. */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-2.5 sm:flex sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <MagnifyingGlass size={16} className="absolute left-3 max-sm:left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={tGenerated("searchSavedListings")}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setPage(1)
              }}
              className="pl-9 h-9 text-xs sm:text-sm bg-background max-sm:h-11 max-sm:rounded-full max-sm:bg-card max-sm:pl-10 max-sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2 max-sm:order-3 max-sm:col-span-2">
            <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value as string); setPage(1) }}>
              <SelectTrigger className="h-9 flex-1 sm:w-44 text-xs sm:text-sm bg-background max-sm:min-w-0 max-sm:rounded-full max-sm:bg-card">
                <Funnel size={14} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder={tGenerated("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">{tGenerated("allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-xs">{getLocalizedName(category)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={(value) => { setSortOption(value as FavoriteSortOption); setPage(1) }}>
              <SelectTrigger className="h-9 flex-1 sm:w-44 text-xs sm:text-sm bg-background max-sm:min-w-0 max-sm:rounded-full max-sm:bg-card">
                <ArrowsDownUp size={14} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder={tGenerated("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent" className="text-xs">{tGenerated("recentlySaved")}</SelectItem>
                <SelectItem value="newest" className="text-xs">{tGenerated("newestListing")}</SelectItem>
                <SelectItem value="price_asc" className="text-xs">{tGenerated("priceLowToHigh")}</SelectItem>
                <SelectItem value="price_desc" className="text-xs">{tGenerated("priceHighToLow")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="max-sm:order-2">
            <ListingViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {favorites.isPending ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-3" aria-busy="true" aria-label={tGenerated("loadingSavedListings")}>{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />)}</div>
        ) : favorites.isError ? (
          <div className="rounded-xl border border-destructive/30 bg-card p-10 text-center">
            <p className="text-sm font-semibold text-destructive"><LocalizedText id="weCouldnTLoadYourSavedListings" /></p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => favorites.refetch()}><LocalizedText id="tryAgain" /></Button>
          </div>
        ) : cards.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <ListingGrid listings={cards} className="grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5" />
            ) : (
              <div className="space-y-2.5 sm:space-y-3">{cards.map((listing) => <ListingListRow key={listing.id} listing={listing} />)}</div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/70 pt-4">
                <span className="text-xs text-muted-foreground">
                  {tDynamic("pageOf", { page: pagination.page, totalPages: pagination.totalPages })}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><LocalizedText id="previous" /></Button>
                  <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}><LocalizedText id="next" /></Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 p-6 sm:p-10 bg-card/40 max-sm:border-0 max-sm:bg-transparent max-sm:px-2 max-sm:py-10">
            <EmptyState
              icon={hasFilters ? <MagnifyingGlass size={32} className="text-muted-foreground" /> : <Heart size={32} className="text-muted-foreground" />}
              title={hasFilters ? tGenerated("noSavedListingsMatch") : tGenerated("noSavedListingsYet")}
              description={hasFilters ? tGenerated("tryChangingYourSearchTermOrCategoryFilter") : tGenerated("browseMarketplaceListingsAndUseTheHeartButtonTo")}
              action={hasFilters ? {
                label: tGenerated("clearFilters"),
                onClick: () => { setSearchQuery(""); setCategoryFilter("all"); setPage(1) },
              } : { label: tGenerated("browseMarketplace"), href: "/search" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
