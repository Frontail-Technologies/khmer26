import type { CategoryField } from "@/features/categories/api/categories.api"

export const SORT_VALUES = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "recently_updated",
] as const
export type SortValue = (typeof SORT_VALUES)[number]
export const DEFAULT_SORT: SortValue = "newest"

/** Presentation labels only; the API always receives the SortValue. */
export const SORT_LABELS: Record<SortValue, string> = {
  newest: "Newest",
  oldest: "Oldest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  recently_updated: "Recently Updated",
}

export const CURRENCIES = ["USD", "KHR"] as const
export type Currency = (typeof CURRENCIES)[number]

export const FIELD_PARAM_PREFIX = "f."

export interface SearchFilters {
  q?: string
  category?: string
  provinceId?: number
  districtId?: number
  communeId?: number
  minPrice?: number
  maxPrice?: number
  currency?: Currency
  sort: SortValue
  fields: Record<string, string>
}

export const EMPTY_FILTERS: SearchFilters = { sort: DEFAULT_SORT, fields: {} }

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,119}$/i
const FIELD_NAME_PATTERN = /^[a-z0-9_-]{1,80}$/i
const MAX_TEXT_LENGTH = 100

function parsePositiveInt(raw: string | null): number | undefined {
  if (!raw || !/^\d+$/.test(raw)) return undefined
  const value = Number(raw)
  return Number.isSafeInteger(value) && value > 0 ? value : undefined
}

function parseNonNegativeNumber(raw: string | null): number | undefined {
  if (!raw || !/^\d+(\.\d+)?$/.test(raw)) return undefined
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

/** Malformed params are ignored rather than thrown, so a bad URL never crashes the page. */
export function parseSearchFilters(input: { toString(): string }): SearchFilters {
  const params = new URLSearchParams(input.toString())

  const q = params.get("q")?.trim().slice(0, MAX_TEXT_LENGTH) || undefined
  const categoryRaw = params.get("category")?.trim() ?? ""
  const currencyRaw = params.get("currency")?.toUpperCase()
  const sortRaw = params.get("sort")

  const fields: Record<string, string> = {}
  params.forEach((value, key) => {
    if (!key.startsWith(FIELD_PARAM_PREFIX)) return
    const name = key.slice(FIELD_PARAM_PREFIX.length)
    const trimmed = value.trim().slice(0, MAX_TEXT_LENGTH)
    if (FIELD_NAME_PATTERN.test(name) && trimmed) fields[name] = trimmed
  })

  return {
    q,
    category: SLUG_PATTERN.test(categoryRaw) ? categoryRaw : undefined,
    provinceId: parsePositiveInt(params.get("province")),
    districtId: parsePositiveInt(params.get("district")),
    communeId: parsePositiveInt(params.get("commune")),
    minPrice: parseNonNegativeNumber(params.get("minPrice")),
    maxPrice: parseNonNegativeNumber(params.get("maxPrice")),
    currency: CURRENCIES.find((c) => c === currencyRaw),
    sort: SORT_VALUES.find((s) => s === sortRaw) ?? DEFAULT_SORT,
    fields,
  }
}

export function serializeSearchFilters(
  filters: SearchFilters,
  options: { omitCategory?: boolean } = {}
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q) params.set("q", filters.q)
  if (filters.category && !options.omitCategory) params.set("category", filters.category)
  if (filters.provinceId !== undefined) params.set("province", String(filters.provinceId))
  if (filters.districtId !== undefined) params.set("district", String(filters.districtId))
  if (filters.communeId !== undefined) params.set("commune", String(filters.communeId))
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice))
  if (filters.currency) params.set("currency", filters.currency)
  if (filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort)
  for (const name of Object.keys(filters.fields).sort()) {
    params.set(`${FIELD_PARAM_PREFIX}${name}`, filters.fields[name]!)
  }
  return params
}

export interface LocationPatch {
  provinceId?: number | null
  districtId?: number | null
  communeId?: number | null
}

/** null clears a level. Changing a parent level clears its children unless the patch sets them. */
export function applyLocationChange(filters: SearchFilters, patch: LocationPatch): SearchFilters {
  const next = { ...filters }

  if ("provinceId" in patch) {
    next.provinceId = patch.provinceId ?? undefined
    if (next.provinceId !== filters.provinceId) {
      if (!("districtId" in patch)) next.districtId = undefined
      if (!("communeId" in patch)) next.communeId = undefined
    }
  }
  if ("districtId" in patch) {
    next.districtId = patch.districtId ?? undefined
    if (next.districtId !== filters.districtId && !("communeId" in patch)) {
      next.communeId = undefined
    }
  }
  if ("communeId" in patch) {
    next.communeId = patch.communeId ?? undefined
  }
  return next
}

/** Drops a district or commune that is not part of the loaded parent list (stale or hand-edited URL). */
export function reconcileLocation(
  filters: SearchFilters,
  loaded: { districtIds?: number[]; communeIds?: number[] }
): SearchFilters {
  let next = filters
  if (next.districtId === undefined && next.communeId !== undefined) {
    next = { ...next, communeId: undefined }
  }
  if (next.provinceId === undefined && next.districtId !== undefined) {
    next = { ...next, districtId: undefined, communeId: undefined }
  }
  if (
    next.districtId !== undefined &&
    loaded.districtIds &&
    !loaded.districtIds.includes(next.districtId)
  ) {
    next = { ...next, districtId: undefined, communeId: undefined }
  }
  if (
    next.communeId !== undefined &&
    loaded.communeIds &&
    !loaded.communeIds.includes(next.communeId)
  ) {
    next = { ...next, communeId: undefined }
  }
  return next
}

/** Keeps only dynamic filters that match the category's current filterable definitions. */
export function sanitizeFieldFilters(
  fields: Record<string, string>,
  definitions: CategoryField[]
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [name, value] of Object.entries(fields)) {
    const def = definitions.find((d) => d.field.name === name)
    if (!def) continue
    switch (def.field.fieldType) {
      case "select":
        if (def.field.options.some((o) => o.value === value)) result[name] = value
        break
      case "number":
        if (value !== "" && Number.isFinite(Number(value))) result[name] = value
        break
      case "boolean":
        if (value === "true" || value === "false") result[name] = value
        break
      case "text":
      default:
        if (value) result[name] = value
    }
  }
  return result
}

export interface CountOptions {
  /** Count the category as an active filter (search page, where it is removable). */
  includeCategory?: boolean
  /** When known, only fields that are effective for the category count. */
  definitions?: CategoryField[]
}

/**
 * Single definition of "active filters": exactly one per chip the user can remove
 * (keyword, removable category, each location level, price, each known dynamic field).
 */
export function countActiveFilters(filters: SearchFilters, options: CountOptions = {}): number {
  const fields = !filters.category
    ? {}
    : options.definitions
      ? sanitizeFieldFilters(filters.fields, options.definitions)
      : filters.fields
  const hasPrice = filters.minPrice !== undefined || filters.maxPrice !== undefined

  return (
    (filters.q ? 1 : 0) +
    (options.includeCategory && filters.category ? 1 : 0) +
    (filters.provinceId !== undefined ? 1 : 0) +
    (filters.districtId !== undefined ? 1 : 0) +
    (filters.communeId !== undefined ? 1 : 0) +
    (hasPrice || filters.currency ? 1 : 0) +
    Object.keys(fields).length
  )
}

/**
 * Shared by the sidebar "Reset" and the "Clear all" chip. Clears keyword, location, price,
 * currency, sort and dynamic fields. The route's own category (category pages) is kept;
 * on /search the category is a filter and is cleared too.
 */
export function clearAllFilters(
  filters: SearchFilters,
  options: { preserveCategory: boolean }
): SearchFilters {
  return {
    category: options.preserveCategory ? filters.category : undefined,
    sort: DEFAULT_SORT,
    fields: {},
  }
}

/** Dynamic filters that stay valid in the target category's effective definitions. */
export function carryFieldsToCategory(
  fields: Record<string, string>,
  targetDefinitions: CategoryField[]
): Record<string, string> {
  return sanitizeFieldFilters(fields, targetDefinitions)
}
