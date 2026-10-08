import type { QueryClient } from "@tanstack/react-query"
import {
  categoryFieldsQueryOptions,
  selectFilterableFields,
} from "@/features/categories/api/categories.queries"
import { carryFieldsToCategory, type SearchFilters } from "./search-filters"

/**
 * Filters for a category switch: shared filters stay, and dynamic `f.*` filters stay only if the
 * target category's effective definitions still contain them. If they cannot be loaded they are dropped.
 */
export async function carryFiltersToCategory(
  queryClient: QueryClient,
  filters: SearchFilters,
  targetSlug: string
): Promise<SearchFilters> {
  if (Object.keys(filters.fields).length === 0) {
    return { ...filters, category: targetSlug }
  }
  try {
    const definitions = await queryClient.fetchQuery(categoryFieldsQueryOptions(targetSlug))
    return {
      ...filters,
      category: targetSlug,
      fields: carryFieldsToCategory(filters.fields, selectFilterableFields(definitions)),
    }
  } catch {
    return { ...filters, category: targetSlug, fields: {} }
  }
}
