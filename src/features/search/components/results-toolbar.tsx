"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import type { ReactNode } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SORT_LABEL_KEYS, SORT_VALUES, type SortValue } from "../lib/search-filters"
import { ArrowsDownUp, Check, Funnel } from "@phosphor-icons/react"
import {
  ListingViewToggle,
  type ListingViewMode,
} from "@/features/listings/components/listing-view-toggle"

interface ResultsToolbarProps {
  totalResults?: number
  sortBy: SortValue
  onSortChange: (sort: SortValue) => void
  onOpenMobileFilters?: () => void
  activeFilterCount?: number
  viewMode?: ListingViewMode
  onViewModeChange?: (mode: ListingViewMode) => void
  extraAction?: ReactNode
  /** Desktop filter controls shown on the left of the bar (below lg the filter button opens the sheet). */
  filterControls?: ReactNode
}

export function ResultsToolbar({
  totalResults,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount = 0,
  viewMode,
  onViewModeChange,
  extraAction,
  filterControls,
}: ResultsToolbarProps) {
  const tGenerated = useTranslations("generated")
  const tSort = useTranslations("ui.sort")
  return (
    <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 py-2 shadow-2xs sm:px-3.5 sm:py-2.5 lg:sticky lg:top-15 lg:z-30">
      {filterControls && <div className="hidden min-w-0 lg:block">{filterControls}</div>}
      <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-foreground sm:text-sm lg:ml-auto lg:mr-2">
        <span className="text-foreground font-bold">
          {totalResults === undefined ? "—" : totalResults.toLocaleString()}
        </span>
        <span className="text-muted-foreground font-normal truncate">
          <LocalizedText id="resultsFound" />
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {extraAction}
        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none lg:hidden cursor-pointer"
            aria-label={tGenerated("openFilters")}
          >
            <Funnel size={14} className="text-primary" weight="bold" />
            <span className="hidden sm:inline"><LocalizedText id="filter" /></span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none cursor-pointer"
            aria-label={tGenerated("sortOptions")}
          >
            <ArrowsDownUp size={13} className="text-primary" weight="bold" />
            <span className="text-muted-foreground font-normal hidden md:inline">
              <LocalizedText id="sort" />
            </span>
            <span className="hidden sm:inline">{tSort(SORT_LABEL_KEYS[sortBy])}</span>
            <span className="sm:hidden"><LocalizedText id="sort_adc4e9" /></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-xl">
            {SORT_VALUES.map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onSortChange(key)}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5 rounded-md"
              >
                <span className={sortBy === key ? "font-bold text-primary" : ""}>
                  {tSort(SORT_LABEL_KEYS[key])}
                </span>
                {sortBy === key && (
                  <Check size={14} weight="bold" className="text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {viewMode && onViewModeChange && (
          <ListingViewToggle
            viewMode={viewMode}
            onChange={onViewModeChange}
          />
        )}
      </div>
    </div>
  )
}
