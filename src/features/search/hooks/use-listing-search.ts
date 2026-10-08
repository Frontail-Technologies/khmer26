import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { searchListings, type ListingSearchInput } from "@/features/listings/api/listings.api"

export function useListingSearch(input: ListingSearchInput, enabled = true) {
  return useInfiniteQuery({
    queryKey: marketplaceKeys.search.results({ ...input }),
    queryFn: ({ pageParam }) => searchListings(input, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    placeholderData: keepPreviousData,
    enabled,
  })
}
