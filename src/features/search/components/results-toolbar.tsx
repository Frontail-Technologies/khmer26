"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SortOption } from "@/features/search/types"
import { ArrowsDownUp, Check, Funnel } from "@phosphor-icons/react"

interface ResultsToolbarProps {
  totalResults: number
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onOpenMobileFilters?: () => void
  activeFilterCount?: number
}

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Recommended",
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
}

export function ResultsToolbar({
  totalResults,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount = 0,
}: ResultsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-2xs mb-3">
      <div className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5 min-w-0">
        <span className="text-foreground font-bold">{totalResults}</span>
        <span className="text-muted-foreground font-normal truncate">results found</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none lg:hidden cursor-pointer"
            aria-label="Open filters"
          >
            <Funnel size={14} className="text-primary" weight="bold" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none cursor-pointer"
            aria-label="Sort options"
          >
            <ArrowsDownUp size={13} className="text-primary" weight="bold" />
            <span className="text-muted-foreground font-normal hidden md:inline">Sort:</span>
            <span className="hidden sm:inline">{SORT_LABELS[sortBy]}</span>
            <span className="sm:hidden">Sort</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-xl">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onSortChange(key)}
                className="flex items-center justify-between text-xs cursor-pointer py-1.5 rounded-md"
              >
                <span className={sortBy === key ? "font-bold text-primary" : ""}>
                  {SORT_LABELS[key]}
                </span>
                {sortBy === key && <Check size={14} weight="bold" className="text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
