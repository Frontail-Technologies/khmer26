"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Funnel, X } from "@phosphor-icons/react"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { clearAllFilters, countActiveFilters, type SearchFilters } from "../lib/search-filters"
import { FilterPanel, type CategoryNavData } from "./filter-panel"

interface MobileFilterSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  filters: SearchFilters
  onApplyFilters: (filters: SearchFilters) => void
  definitions?: CategoryField[]
  fieldsLoading?: boolean
  categoryNav?: CategoryNavData | null
  /** True on /category/... where the route owns the category (not a removable filter). */
  isCategoryRoute: boolean
}

export function MobileFilterSheet({
  isOpen,
  onOpenChange,
  filters,
  onApplyFilters,
  definitions,
  fieldsLoading,
  categoryNav,
  isCategoryRoute,
}: MobileFilterSheetProps) {
  const [draft, setDraft] = useState<SearchFilters>(filters)

  const handleOpen = (open: boolean) => {
    if (open) setDraft(filters)
    onOpenChange(open)
  }

  const handleApply = () => {
    onApplyFilters(draft)
    onOpenChange(false)
  }

  const nav: CategoryNavData | null = categoryNav
    ? {
        ...categoryNav,
        onSelect: (slug) => {
          onOpenChange(false)
          categoryNav.onSelect(slug)
        },
      }
    : null

  const activeCount = countActiveFilters(draft, {
    includeCategory: !isCategoryRoute,
    definitions,
  })

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[85vh] max-h-[85vh] rounded-t-2xl p-0 flex flex-col overflow-hidden bg-card z-70"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <Funnel size={18} className="text-primary" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </SheetTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 text-sm">
          <FilterPanel
            filters={draft}
            onChange={setDraft}
            definitions={definitions}
            fieldsLoading={fieldsLoading}
            categoryNav={nav}
          />
        </div>

        <div className="sticky bottom-0 z-20 flex items-center gap-3 border-t border-border bg-card p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft(clearAllFilters(draft, { preserveCategory: isCategoryRoute }))}
            className="flex-1 font-medium text-xs h-10 cursor-pointer"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-2 bg-primary text-primary-foreground font-semibold text-xs h-10 shadow-xs cursor-pointer"
          >
            Show results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
