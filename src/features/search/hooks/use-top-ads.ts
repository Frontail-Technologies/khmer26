import { useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { searchListings, type ListingSearchInput } from "@/features/listings/api/listings.api"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { sanitizeFieldFilters, type SearchFilters } from "../lib/search-filters"

const STRIP_SIZE = 10

/** Promoted ("Top Ads") listings that match the current filters. */
export function useTopAds(filters: SearchFilters, definitions?: CategoryField[]) {
  const input: ListingSearchInput = {
    q: filters.q,
    category: filters.category,
    provinceId: filters.provinceId,
    districtId: filters.districtId,
    communeId: filters.communeId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    currency: filters.currency,
    sort: "newest",
    fields: definitions ? sanitizeFieldFilters(filters.fields, definitions) : {},
    featuredOnly: true,
  }
  const { data } = useQuery({
    queryKey: marketplaceKeys.search.results({ ...input, strip: true }),
    queryFn: () => searchListings(input, 1, STRIP_SIZE),
  })
  return data?.items.map(toListingCardData) ?? []
}
