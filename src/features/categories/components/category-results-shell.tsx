"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { ListingListRow } from "@/features/listings/components/listing-list-row"
import { useListingViewMode } from "@/features/listings/hooks/use-listing-view-mode"
import type { ListingCard } from "@/types"
import type { FilterState, SortOption } from "@/features/search/types"
import { DesktopFilterSidebar } from "@/features/search/components/desktop-filter-sidebar"
import { MobileFilterSheet } from "@/features/search/components/mobile-filter-sheet"
import { ActiveFilterChips } from "@/features/search/components/active-filter-chips"
import { ResultsToolbar } from "@/features/search/components/results-toolbar"
import { CategoryEmptyState } from "./category-empty-state"
import { SpinnerGap, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import type { ResolvedCategoryTaxonomy } from "../lib/category-taxonomy"

interface CategoryResultsShellProps {
  taxonomy: ResolvedCategoryTaxonomy
  initialListings: ListingCard[]
}

const ITEMS_PER_BATCH = 12

export function CategoryResultsShell({
  taxonomy,
  initialListings,
}: CategoryResultsShellProps) {
  const { rootCategory, currentSubcategory, currentLeaf, isRoot } = taxonomy

  const [filters, setFilters] = useState<FilterState>({
    category: undefined,
    location: undefined,
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    yearFrom: undefined,
    yearTo: undefined,
    conditions: [],
    fuels: [],
    transmissions: [],
    sellerTypes: [],
    verifiedOnly: false,
  })

  const [sortBy, setSortBy] = useState<SortOption>("recommended")
  const [viewMode, setViewMode] = useListingViewMode()
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_BATCH)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const observerTargetRef = useRef<HTMLDivElement>(null)

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
    setVisibleCount(ITEMS_PER_BATCH)
  }

  const handleClearAll = () => {
    setFilters({
      category: undefined,
      location: undefined,
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      conditions: [],
      fuels: [],
      transmissions: [],
      sellerTypes: [],
      verifiedOnly: false,
    })
    setVisibleCount(ITEMS_PER_BATCH)
  }

  const handleRemoveFilter = (key: keyof FilterState, value?: string) => {
    if (value && Array.isArray(filters[key])) {
      const arr = filters[key] as string[]
      handleFilterChange({ [key]: arr.filter((v) => v !== value) })
    } else {
      handleFilterChange({ [key]: undefined })
    }
  }

  const categoryScopedListings = useMemo(() => {
    return initialListings.filter((item) => {
      const path = item.categoryPath.map((p) => p.toLowerCase())

      if (currentLeaf) {
        const leaf = currentLeaf.slug.toLowerCase()
        return path.includes(leaf) || path.some((p) => p.includes(leaf))
      }

      if (currentSubcategory) {
        const sub = currentSubcategory.slug.toLowerCase()
        const subId = currentSubcategory.id.toLowerCase()
        return (
          path.includes(sub) ||
          path.includes(subId) ||
          path.some((p) => p.includes(sub) || sub.includes(p))
        )
      }

      const rootSlug = rootCategory.slug.toLowerCase()
      const rootId = rootCategory.id.toLowerCase()
      const subSlugs = rootCategory.subcategories.map((s) => s.slug.toLowerCase())
      const subIds = rootCategory.subcategories.map((s) => s.id.toLowerCase())

      const isRootMatch =
        path.includes(rootSlug) ||
        path.includes(rootId) ||
        path.some((p) => rootSlug.includes(p) || p.includes(rootSlug))

      const isSubMatch = path.some(
        (p) => subSlugs.includes(p) || subIds.includes(p)
      )

      return isRootMatch || isSubMatch
    })
  }, [initialListings, rootCategory, currentSubcategory, currentLeaf])

  const filteredListings = useMemo(() => {
    return categoryScopedListings.filter((item) => {
      if (filters.location && filters.location !== "All Locations") {
        const loc = filters.location.toLowerCase()
        const itemLoc = (
          item.location.province +
          " " +
          (item.location.district || "")
        ).toLowerCase()
        if (!itemLoc.includes(loc)) return false
      }

      if (filters.brands.length > 0) {
        if (!item.brand || !filters.brands.includes(item.brand)) return false
      }

      if (filters.minPrice !== undefined && item.price < filters.minPrice) {
        return false
      }

      if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
        return false
      }

      if (filters.yearFrom !== undefined && item.year && item.year < filters.yearFrom) {
        return false
      }

      if (filters.yearTo !== undefined && item.year && item.year > filters.yearTo) {
        return false
      }

      if (filters.conditions.length > 0) {
        if (!filters.conditions.includes(item.condition)) return false
      }

      if (filters.fuels.length > 0) {
        if (!item.fuel || !filters.fuels.includes(item.fuel)) return false
      }

      if (filters.transmissions.length > 0) {
        if (!item.transmission || !filters.transmissions.includes(item.transmission)) return false
      }

      if (filters.sellerTypes.length > 0) {
        if (!item.sellerType || !filters.sellerTypes.includes(item.sellerType)) return false
      }

      if (filters.verifiedOnly && !item.verified) {
        return false
      }

      return true
    })
  }, [categoryScopedListings, filters])

  const sortedListings = useMemo(() => {
    const list = [...filteredListings]
    switch (sortBy) {
      case "newest":
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case "price_asc":
        return list.sort((a, b) => a.price - b.price)
      case "price_desc":
        return list.sort((a, b) => b.price - a.price)
      case "recommended":
      default:
        return list.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }
  }, [filteredListings, sortBy])

  const displayedListings = useMemo(() => {
    return sortedListings.slice(0, visibleCount)
  }, [sortedListings, visibleCount])

  const hasMore = visibleCount < sortedListings.length

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_BATCH, sortedListings.length))
      setIsLoadingMore(false)
    }, 200)
  }, [isLoadingMore, hasMore, sortedListings.length])

  useEffect(() => {
    const target = observerTargetRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "300px" }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

  const activeFilterCount =
    (filters.location ? 1 : 0) +
    filters.brands.length +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.yearFrom !== undefined || filters.yearTo !== undefined ? 1 : 0) +
    filters.conditions.length +
    filters.fuels.length +
    filters.transmissions.length +
    filters.sellerTypes.length +
    (filters.verifiedOnly ? 1 : 0)

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6 pt-1">
      <div className="hidden lg:block shrink-0 sticky top-18 self-start">
        <DesktopFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="flex-1 min-w-0">
        <ResultsToolbar
          totalResults={sortedListings.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onOpenMobileFilters={() => setIsMobileSheetOpen(true)}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ActiveFilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        <div>
          {displayedListings.length > 0 ? (
            <div className="space-y-6">
              {viewMode === "grid" ? (
                <ListingGrid
                  listings={displayedListings}
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4"
                />
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {displayedListings.map((listing) => (
                    <ListingListRow key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              <div ref={observerTargetRef} className="py-4 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground shadow-xs animate-pulse">
                    <SpinnerGap size={16} className="animate-spin text-primary" />
                    <span>Loading more listings...</span>
                  </div>
                ) : hasMore ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadMore}
                    className="text-xs font-semibold px-4 h-9 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-colors"
                  >
                    Load more listings
                  </Button>
                ) : sortedListings.length > ITEMS_PER_BATCH ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-2 font-medium">
                    <CheckCircle size={14} weight="bold" className="text-primary" />
                    <span>You have viewed all {sortedListings.length} listings</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <CategoryEmptyState
              rootCategoryName={rootCategory.name}
              rootCategorySlug={rootCategory.slug}
              isRoot={isRoot}
            />
          )}
        </div>
      </div>

      <MobileFilterSheet
        isOpen={isMobileSheetOpen}
        onOpenChange={setIsMobileSheetOpen}
        filters={filters}
        onApplyFilters={(f) => {
          setFilters(f)
          setVisibleCount(ITEMS_PER_BATCH)
        }}
        totalMatching={filteredListings.length}
      />
    </div>
  )
}
