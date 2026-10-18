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
import { SellerResults } from "./seller-results"
import { useLocalizedName } from "@/lib/i18n/localized"
import { useTranslations } from "next-intl"

export function SearchPageContent() {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
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

  const title = filters.q ? tDynamic("resultsFor", { query: filters.q }) : tGenerated("allMarketplaceListings")
  const breadcrumbs = [
    { label: tGenerated("home"), href: "/" },
    { label: tGenerated("search"), href: filters.q || node ? "/search" : undefined },
    ...(node ? [{ label: getLocalizedName(node) }] : []),
    ...(filters.q ? [{ label: `“${filters.q}”` }] : []),
  ]

  return (
    <>
      <ResultsHeader title={title} totalCount={state.total} breadcrumbs={breadcrumbs} />
      {filters.q && <SellerResults q={filters.q} />}
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
