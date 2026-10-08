"use client"

import { useCallback, useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useFilterableFields } from "@/features/categories/api/categories.queries"
import { useDistricts, useCommunes } from "@/features/locations/api/locations.queries"
import {
  parseSearchFilters,
  reconcileLocation,
  sanitizeFieldFilters,
  serializeSearchFilters,
  type SearchFilters,
} from "../lib/search-filters"
import { useListingSearch } from "./use-listing-search"

interface Options {
  /** Category supplied by the route (category pages). It is not stored in the query string. */
  fixedCategory?: string
}

/** URL is the single source of truth for every server-side search/filter value. */
export function useSearchPageState({ fixedCategory }: Options = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramString = searchParams.toString()

  const filters = useMemo<SearchFilters>(() => {
    const parsed = parseSearchFilters(paramString)
    return fixedCategory ? { ...parsed, category: fixedCategory } : parsed
  }, [paramString, fixedCategory])

  const setFilters = useCallback(
    (next: SearchFilters, mode: "push" | "replace" = "push") => {
      const qs = serializeSearchFilters(next, { omitCategory: Boolean(fixedCategory) }).toString()
      router[mode](qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, fixedCategory]
  )

  const fieldsQuery = useFilterableFields(filters.category)
  const definitions = fieldsQuery.data
  const hasFieldParams = Object.keys(filters.fields).length > 0
  const fieldsSettled =
    !hasFieldParams || !filters.category || fieldsQuery.isSuccess || fieldsQuery.isError
  const effectiveFields = useMemo(
    () => (definitions ? sanitizeFieldFilters(filters.fields, definitions) : {}),
    [definitions, filters.fields]
  )

  const search = useListingSearch(
    {
      q: filters.q,
      category: filters.category,
      provinceId: filters.provinceId,
      districtId: filters.districtId,
      communeId: filters.communeId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      currency: filters.currency,
      sort: filters.sort,
      fields: effectiveFields,
    },
    fieldsSettled
  )

  const districts = useDistricts(filters.provinceId)
  const communes = useCommunes(filters.districtId)
  const districtIds = districts.data?.map((d) => d.id)
  const communeIds = communes.data?.map((c) => c.id)
  const reconciled = useMemo(
    () => reconcileLocation(filters, { districtIds, communeIds }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, districts.data, communes.data]
  )
  useEffect(() => {
    if (reconciled !== filters) setFilters(reconciled, "replace")
  }, [reconciled, filters, setFilters])

  // Drop dynamic filters that are not effective for the current category so none stay
  // invisible in the URL (hand-edited links, or a category change that raced the carry-over).
  const hasStaleFields = hasFieldParams && (!filters.category || (definitions !== undefined &&
    Object.keys(effectiveFields).length !== Object.keys(filters.fields).length))
  useEffect(() => {
    if (hasStaleFields) setFilters({ ...filters, fields: effectiveFields }, "replace")
  }, [hasStaleFields, filters, effectiveFields, setFilters])

  const pages = search.data?.pages
  const items = useMemo(() => pages?.flatMap((p) => p.items) ?? [], [pages])
  const total = pages?.[pages.length - 1]?.pagination.total

  return {
    filters,
    setFilters,
    isCategoryRoute: Boolean(fixedCategory),
    definitions,
    fieldsLoading: fieldsQuery.isLoading,
    search,
    items,
    total,
  }
}

export type SearchPageState = ReturnType<typeof useSearchPageState>
