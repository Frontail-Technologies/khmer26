import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { searchListings } from "@/features/listings/api/listings.api"
import {
  findCategorySuggestions,
  type CategoryIndex,
} from "@/features/categories/lib/category-tree"

export const SUGGESTION_MIN_CHARS = 2
export const SUGGESTION_DEBOUNCE_MS = 300
export const LISTING_SUGGESTION_LIMIT = 5
export const CATEGORY_SUGGESTION_LIMIT = 4

interface Options {
  query: string
  /** Scope listing suggestions to the category selected in the header. */
  categorySlug?: string
  index: CategoryIndex | null
}

/**
 * Suggestions come only from existing backend data: categories are matched in the already-loaded
 * tree, listings through GET /listings?q= with a small limit. There is no suggestion endpoint.
 */
export function useSearchSuggestions({ query, categorySlug, index }: Options) {
  const trimmed = query.trim()
  const debounced = useDebouncedValue(trimmed, SUGGESTION_DEBOUNCE_MS)
  const eligible = trimmed.length >= SUGGESTION_MIN_CHARS
  const requestEnabled = debounced.length >= SUGGESTION_MIN_CHARS && eligible

  const listingsQuery = useQuery({
    queryKey: marketplaceKeys.search.suggestions({ q: debounced, category: categorySlug }),
    queryFn: () =>
      searchListings({ q: debounced, category: categorySlug, sort: "newest" }, 1, LISTING_SUGGESTION_LIMIT),
    enabled: requestEnabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })

  const categories = useMemo(
    () => (eligible && index ? findCategorySuggestions(index, trimmed, CATEGORY_SUGGESTION_LIMIT) : []),
    [eligible, index, trimmed]
  )

  return {
    eligible,
    isLoading: requestEnabled && listingsQuery.isFetching,
    categories,
    listings: eligible ? (listingsQuery.data?.items ?? []) : [],
  }
}
