"use client"

import { useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useCategoryTree } from "@/features/categories/api/categories.queries"
import {
  buildCategoryIndex,
  getCategoryPath,
} from "@/features/categories/lib/category-tree"
import { useSearchPageState } from "../hooks/use-search-page-state"
import { carryFiltersToCategory } from "../lib/carry-filters"
import type { CategoryNavData } from "./filter-panel"
import { SearchResultsView } from "./search-results-view"
import { SellerResults } from "./seller-results"
import { SearchTabs } from "./search-tabs"
import { useLocalizedName } from "@/lib/i18n/localized"

export function SearchPageContent({ showSellers = true }: { showSellers?: boolean } = {}) {
  const getLocalizedName = useLocalizedName()
  const state = useSearchPageState()
  const { filters, setFilters } = state
  const tree = useCategoryTree()
  const queryClient = useQueryClient()

  const index = useMemo(() => (tree.data ? buildCategoryIndex(tree.data) : null), [tree.data])
  const node = filters.category ? index?.bySlug.get(filters.category) : undefined
  const path = useMemo(() => (node && index ? getCategoryPath(index, node) : []), [node, index])

  const categoryNav = useMemo<CategoryNavData | null>(
    () =>
      index
        ? {
            roots: index.roots,
            ancestorIds: path.map((n) => n.id),
            onSelect: (slug) => {
              if (!slug) {
                setFilters({ ...filters, category: undefined, fields: {} })
                return
              }
              void carryFiltersToCategory(queryClient, filters, slug).then((next) => setFilters(next))
            },
          }
        : null,
    [index, path, filters, setFilters, queryClient]
  )

  return (
    <>
      {showSellers && filters.q && <SellerResults q={filters.q} />}
      {!showSellers && filters.q && <SearchTabs q={filters.q} />}
      <div id="posts" className="scroll-mt-32">
        <SearchResultsView
          state={state}
          categoryNav={categoryNav}
          categoryChipLabel={filters.category ? (node ? getLocalizedName(node) : filters.category) : undefined}
        />
      </div>
    </>
  )
}
