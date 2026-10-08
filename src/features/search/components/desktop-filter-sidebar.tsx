"use client"

import { Funnel } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { CategoryField } from "@/features/categories/api/categories.api"
import type { SearchFilters } from "../lib/search-filters"
import { FilterPanel, type CategoryNavData } from "./filter-panel"

interface DesktopFilterSidebarProps {
  filters: SearchFilters
  onChange: (next: SearchFilters) => void
  onClearAll: () => void
  activeCount: number
  definitions?: CategoryField[]
  fieldsLoading?: boolean
  categoryNav?: CategoryNavData | null
  className?: string
}

export function DesktopFilterSidebar({
  filters,
  onChange,
  onClearAll,
  activeCount,
  definitions,
  fieldsLoading,
  categoryNav,
  className,
}: DesktopFilterSidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-64 lg:w-70 shrink-0 max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border/80 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Funnel size={16} className="text-primary" weight="bold" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3.5 [scrollbar-gutter:stable]">
        <FilterPanel
          filters={filters}
          onChange={onChange}
          definitions={definitions}
          fieldsLoading={fieldsLoading}
          categoryNav={categoryNav}
        />
      </div>
    </aside>
  )
}
