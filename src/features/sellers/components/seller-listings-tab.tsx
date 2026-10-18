"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { MagnifyingGlass, SortAscending, Storefront, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/shared/EmptyState"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { ListingListRow } from "@/features/listings/components/listing-list-row"
import { ListingViewToggle } from "@/features/listings/components/listing-view-toggle"
import { useListingViewMode } from "@/features/listings/hooks/use-listing-view-mode"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import type { PublicListing } from "@/features/listings/api/listings.api"
import type { Page, SellerCategoryFacet, SellerListingSort } from "../api/sellers.api"
import type { SellerListingUrlFilters } from "../hooks/use-seller-listing-filters"
import { useLocalizedName } from "@/lib/i18n/localized"

const SORT_LABEL_KEYS = {
  newest: "newestFirst",
  price_asc: "priceLowHigh",
  price_desc: "priceHighLow",
} as const satisfies Record<SellerListingSort, string>

interface SellerListingsTabProps {
  sellerName: string
  pages: Array<Page<PublicListing>> | undefined
  isPending: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  onRetry: () => void
  filters: SellerListingUrlFilters
  keyword: string
  onKeywordChange: (value: string) => void
  onCategoryChange: (categoryId: string) => void
  onSortChange: (sort: SellerListingSort) => void
  onClearFilters: () => void
  isFiltered: boolean
  categories: SellerCategoryFacet[]
  /** The seller's unfiltered public total (for the "All" chip). */
  inventoryTotal: number
}

export function SellerListingsTab({
  sellerName,
  pages,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
  filters,
  keyword,
  onKeywordChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
  isFiltered,
  categories,
  inventoryTotal,
}: SellerListingsTabProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const tSort = useTranslations("ui.sort")
  const tUi = useTranslations("ui.common")
  const getLocalizedName = useLocalizedName()
  const [viewMode, setViewMode] = useListingViewMode()

  const items = (pages ?? []).flatMap((p) => p.items)
  const total = pages?.[0]?.pagination.total ?? 0
  // Nothing to filter or sort when the seller has no public inventory at all.
  const showControls = inventoryTotal > 0 || isFiltered

  const chip = (selected: boolean) =>
    `h-8 shrink-0 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors ${
      selected
        ? "bg-primary text-primary-foreground shadow-xs"
        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
    }`

  const controls = showControls && (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder={`Search ${sellerName}'s listings`}
            aria-label={tGenerated("searchThisSellerSListings")}
            className="h-9 bg-muted/30 pl-9 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <Select value={filters.sort} onValueChange={(v) => v && onSortChange(v as SellerListingSort)}>
            <SelectTrigger
              aria-label={tGenerated("sortListings")}
              className="h-9 min-w-40 gap-2 rounded-lg border-border/80 bg-background px-3 text-xs font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <SortAscending size={15} className="shrink-0 text-primary" />
                <SelectValue>{tSort(SORT_LABEL_KEYS[filters.sort])}</SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent side="bottom" align="end">
              {(Object.keys(SORT_LABEL_KEYS) as SellerListingSort[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {tSort(SORT_LABEL_KEYS[s])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ListingViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={tGenerated("filterByCategory")}>
          <button type="button" className={chip(filters.category === "")} onClick={() => onCategoryChange("")}>
            {tDynamic("allCount", { count: inventoryTotal })}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={chip(filters.category === c.id)}
              onClick={() => onCategoryChange(c.id)}
              aria-pressed={filters.category === c.id}
            >
              {getLocalizedName(c)} ({c.count})
            </button>
          ))}
        </div>
      )}
    </div>
  )

  if (isPending) {
    return (
      <div className="space-y-4">
        {controls}
        <div
          aria-busy="true"
          aria-label={tGenerated("loadingListings")}
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/5 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError && !pages) {
    return (
      <EmptyState
        icon={<Storefront size={32} aria-hidden="true" />}
        title={tGenerated("couldnTLoadListings")}
        description={tGenerated("checkConnectionTryAgain")}
        action={{ label: tUi("tryAgain"), onClick: onRetry }}
      />
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        {controls}
        {isFiltered ? (
          <EmptyState
            icon={<Storefront size={32} aria-hidden="true" />}
            title={tGenerated("noListingsMatchYourSearch")}
            description={tGenerated("tryDifferentKeywordOrCategory")}
            action={{ label: tUi("clearFilters"), onClick: onClearFilters }}
          />
        ) : (
          <EmptyState
            icon={<Storefront size={32} aria-hidden="true" />}
            title={tGenerated("noActiveListings")}
            description={`${sellerName} has no active listings at the moment.`}
          />
        )}
      </div>
    )
  }

  const cards = items.map(toListingCardData)

  return (
    <div className="space-y-4">
      {controls}

      <div className="flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <span>
          {tDynamic("showingListings", { shown: items.length, total })}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex cursor-pointer items-center gap-1 font-semibold text-primary hover:underline"
          >
            <X size={12} weight="bold" />
            <LocalizedText id="clearFilters" />
          </button>
        )}
      </div>

      {viewMode === "grid" ? (
        <ListingGrid listings={cards} />
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {cards.map((listing) => (
            <ListingListRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {isError && (
        <p role="alert" className="text-center text-xs font-medium text-destructive">
          <LocalizedText id="couldnTLoadMoreListings" />
        </p>
      )}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="h-10 rounded-lg border-border px-6 text-xs font-semibold hover:bg-muted sm:text-sm"
          >
            {isFetchingNextPage ? tGenerated("loading") : tGenerated("loadMoreListings")}
          </Button>
        </div>
      )}
    </div>
  )
}
