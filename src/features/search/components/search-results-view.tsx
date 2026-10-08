"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowCounterClockwise, CheckCircle, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { ListingListRow } from "@/features/listings/components/listing-list-row"
import { useListingViewMode } from "@/features/listings/hooks/use-listing-view-mode"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import { clearAllFilters, countActiveFilters } from "../lib/search-filters"
import type { SearchPageState } from "../hooks/use-search-page-state"
import { ActiveFilterChips } from "./active-filter-chips"
import { DesktopFilterSidebar } from "./desktop-filter-sidebar"
import type { CategoryNavData } from "./filter-panel"
import { MobileFilterSheet } from "./mobile-filter-sheet"
import { ResultsToolbar } from "./results-toolbar"

interface SearchResultsViewProps {
  state: SearchPageState
  categoryNav?: CategoryNavData | null
  /** Search page only: label for the removable category chip. */
  categoryChipLabel?: string
  /** Shown instead of the generic empty state when nothing but the category itself is selected. */
  categoryEmptyState?: ReactNode
}

const GRID_CLASS =
  "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4"

function ResultsSkeleton() {
  return (
    <div className={GRID_CLASS} aria-busy="true" aria-label="Loading results">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
      ))}
    </div>
  )
}

export function SearchResultsView({
  state,
  categoryNav,
  categoryChipLabel,
  categoryEmptyState,
}: SearchResultsViewProps) {
  const { filters, setFilters, definitions, fieldsLoading, search, items, total, isCategoryRoute } =
    state
  const [viewMode, setViewMode] = useListingViewMode()
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const observerTargetRef = useRef<HTMLDivElement>(null)

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = search
  // One definition of "active": the same count drives the sidebar, the drawer and the chips.
  const activeCount = countActiveFilters(filters, {
    includeCategory: !isCategoryRoute,
    definitions,
  })
  const hasClearable = activeCount > 0
  const hasRefinements = hasClearable || Boolean(!isCategoryRoute && filters.category)
  const cards = items.map(toListingCardData)
  const isRefreshing = search.isPlaceholderData

  useEffect(() => {
    const target = observerTargetRef.current
    if (!target || !hasNextPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage()
      },
      { rootMargin: "300px" }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleClearAll = () =>
    setFilters(clearAllFilters(filters, { preserveCategory: isCategoryRoute }))

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      <div className="hidden lg:block shrink-0 sticky top-18 self-start">
        <DesktopFilterSidebar
          filters={filters}
          onChange={setFilters}
          onClearAll={handleClearAll}
          activeCount={activeCount}
          definitions={definitions}
          fieldsLoading={fieldsLoading}
          categoryNav={categoryNav}
        />
      </div>

      <div className="flex-1 min-w-0">
        <ResultsToolbar
          totalResults={total}
          sortBy={filters.sort}
          onSortChange={(sort) => setFilters({ ...filters, sort })}
          onOpenMobileFilters={() => setIsMobileSheetOpen(true)}
          activeFilterCount={activeCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ActiveFilterChips
          filters={filters}
          onChange={setFilters}
          onClearAll={handleClearAll}
          definitions={definitions}
          categoryChipLabel={categoryChipLabel}
        />

        <div className={cn("transition-opacity", isRefreshing && "opacity-60")}>
          {search.isPending ? (
            <ResultsSkeleton />
          ) : search.isError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card py-14 px-6 text-center shadow-2xs">
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                We couldn&apos;t load the results.
              </h3>
              <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground">
                Check your connection and try again, or clear some filters.
              </p>
              <div className="mt-5 flex items-center gap-2.5">
                <Button size="sm" onClick={() => search.refetch()} className="h-9 text-xs font-semibold">
                  Try again
                </Button>
                {hasClearable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearAll}
                    className="h-9 text-xs font-semibold"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          ) : cards.length > 0 ? (
            <div className="space-y-6">
              {viewMode === "grid" ? (
                <ListingGrid listings={cards} className={GRID_CLASS} />
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {cards.map((listing) => (
                    <ListingListRow key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              <div ref={observerTargetRef} className="py-4 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground shadow-xs animate-pulse">
                    <SpinnerGap size={16} className="animate-spin text-primary" />
                    <span>Loading more listings...</span>
                  </div>
                ) : hasNextPage ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    className="text-xs font-semibold px-4 h-9 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-colors"
                  >
                    Load more listings
                  </Button>
                ) : cards.length > 12 ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-2 font-medium">
                    <CheckCircle size={14} weight="bold" className="text-primary" />
                    <span>You have viewed all {total} listings</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : categoryEmptyState && !hasRefinements ? (
            categoryEmptyState
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card py-16 px-6 text-center shadow-2xs">
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                No Result Found
              </h3>
              <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground">
                {hasRefinements
                  ? "No listings match these filters. Try adjusting or clearing them."
                  : "There are no active listings to show yet."}
              </p>
              {hasClearable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="mt-5 font-semibold text-xs h-9 px-4 gap-1.5 rounded-lg cursor-pointer hover:bg-muted"
                >
                  <ArrowCounterClockwise size={14} />
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <MobileFilterSheet
        isOpen={isMobileSheetOpen}
        onOpenChange={setIsMobileSheetOpen}
        filters={filters}
        onApplyFilters={setFilters}
        isCategoryRoute={isCategoryRoute}
        definitions={definitions}
        fieldsLoading={fieldsLoading}
        categoryNav={categoryNav}
      />
    </div>
  )
}
