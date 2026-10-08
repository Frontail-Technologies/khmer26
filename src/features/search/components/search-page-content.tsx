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
import { ResultsHeader } from "./results-header"
import { SearchResultsView } from "./search-results-view"

export function SearchPageContent() {
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

  const title = filters.q ? `Results for “${filters.q}”` : "All Marketplace Listings"
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: filters.q || node ? "/search" : undefined },
    ...(node ? [{ label: node.nameEn }] : []),
    ...(filters.q ? [{ label: `“${filters.q}”` }] : []),
  ]

  return (
    <>
      <ResultsHeader title={title} totalCount={state.total} breadcrumbs={breadcrumbs} />
      <SearchResultsView
        state={state}
        categoryNav={categoryNav}
        categoryChipLabel={filters.category ? (node?.nameEn ?? filters.category) : undefined}
      />
    </>
  )
}
