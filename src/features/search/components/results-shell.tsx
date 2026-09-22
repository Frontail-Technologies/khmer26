"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import type { ListingCard } from "@/types"
import type { FilterState, SortOption } from "@/features/search/types"
import { DesktopFilterSidebar } from "./desktop-filter-sidebar"
import { MobileFilterSheet } from "./mobile-filter-sheet"
import { ActiveFilterChips } from "./active-filter-chips"
import { ResultsToolbar } from "./results-toolbar"
import {
  ArrowCounterClockwise,
  SpinnerGap,
  CheckCircle,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface ResultsShellProps {
  initialListings: ListingCard[]
  initialCategory?: string
  initialLocation?: string
  initialQuery?: string
}

const ITEMS_PER_BATCH = 12

export function ResultsShell({
  initialListings,
  initialCategory,
  initialLocation,
  initialQuery,
}: ResultsShellProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    location: initialLocation,
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
    searchQuery: initialQuery,
  })

  const [sortBy, setSortBy] = useState<SortOption>("recommended")
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
      searchQuery: undefined,
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

  const filteredListings = useMemo(() => {
    return initialListings.filter((item) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim()
        const titleMatch = item.title.toLowerCase().includes(q)
        const brandMatch = item.brand?.toLowerCase().includes(q)
        const catMatch = item.categoryPath.some((c) => c.toLowerCase().includes(q))
        const locMatch = (item.location.province + " " + (item.location.district || "")).toLowerCase().includes(q)
        if (!titleMatch && !brandMatch && !catMatch && !locMatch) return false
      }

      if (filters.category) {
        const cat = filters.category.toLowerCase()
        const matchesCat =
          item.categoryPath.some((c) => c.toLowerCase() === cat) ||
          item.categoryPath.some((c) => c.toLowerCase().includes(cat))
        if (!matchesCat) return false
      }

      if (filters.location && filters.location !== "All Locations") {
        const loc = filters.location.toLowerCase()
        const itemLoc = (item.location.province + " " + (item.location.district || "")).toLowerCase()
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
  }, [initialListings, filters])

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
    (filters.category ? 1 : 0) +
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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
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
        />

        <ActiveFilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        <div>
          {displayedListings.length > 0 ? (
            <div className="space-y-6">
              <ListingGrid
                listings={displayedListings}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4"
              />

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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card py-16 px-6 text-center shadow-2xs">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-muted/60 mb-4 text-muted-foreground/80">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  aria-hidden="true"
                >
                  <path
                    d="M26 10L35 24H17L26 10Z"
                    fill="currentColor"
                  />
                  <rect
                    x="15"
                    y="27"
                    width="11"
                    height="11"
                    rx="2"
                    fill="currentColor"
                  />
                  <circle
                    cx="34"
                    cy="32.5"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M38 36.5L43 41.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                No Result Found
              </h3>
              <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground">
                Try adjusting your filters or search keywords to find available listings.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="mt-5 font-semibold text-xs h-9 px-4 gap-1.5 rounded-lg cursor-pointer hover:bg-muted"
              >
                <ArrowCounterClockwise size={14} />
                Clear all filters
              </Button>
            </div>
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
