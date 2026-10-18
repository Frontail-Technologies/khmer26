"use client"

import { useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { revealListingContacts } from "../api/listing-detail.api"

/**
 * The single reveal state for a listing's contact numbers. Every component that shows the
 * numbers (seller card, Contact Phones section) uses this hook with the same query key, so
 * there is one backend request and one revealed/not-revealed state across the page.
 *
 * The query never runs on its own: `reveal()` triggers it, concurrent calls are deduplicated by
 * TanStack Query, and the result stays cached for the session of the page.
 */
export function useContactReveal(listingId: string) {
  const query = useQuery({
    queryKey: marketplaceKeys.listings.contacts(listingId),
    queryFn: () => revealListingContacts(listingId),
    enabled: false,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    retry: false,
  })

  return {
    revealed: query.data,
    isPending: query.isFetching,
    error: query.isError ? query.error : null,
    reveal: () => {
      if (!query.isFetching && !query.data) void query.refetch()
    },
    /** Same request, but resolves with the numbers (undefined on failure). Deduplicated like reveal(). */
    revealAsync: async () => {
      if (query.data) return query.data
      const result = await query.refetch()
      return result.data
    },
  }
}
