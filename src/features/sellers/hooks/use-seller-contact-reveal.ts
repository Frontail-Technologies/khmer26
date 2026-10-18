"use client"

import { useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { revealSellerContacts } from "../api/sellers.api"

/**
 * Reveal state for a seller's public numbers on the seller profile. Same pattern as the listing
 * page (a query that only runs when `reveal()` is called, deduplicated, cached for the session of
 * the page) against the seller-level endpoint. Revealed numbers are never written anywhere else.
 */
export function useSellerContactReveal(sellerId: string) {
  const query = useQuery({
    queryKey: marketplaceKeys.sellers.contacts(sellerId),
    queryFn: () => revealSellerContacts(sellerId),
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
  }
}
