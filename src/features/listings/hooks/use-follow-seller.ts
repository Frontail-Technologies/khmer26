"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { marketplaceKeys } from "@/lib/query/keys"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { followSeller, unfollowSeller, type ListingDetail } from "../api/listing-detail.api"
import { describeError } from "./use-start-conversation"

interface FollowableSeller {
  isFollowing: boolean
}

/**
 * Follow / unfollow through the backend, shared by the listing page and the seller page.
 * The followed state is cached in the seller detail and inside every cached listing detail that
 * belongs to that seller. All of them are updated optimistically, rolled back together on
 * failure, and refetched afterwards, so both pages always show the same state.
 * Signed-out visitors are sent to login.
 */
export function useFollowSeller(sellerId: string) {
  const queryClient = useQueryClient()
  const requireAuth = useRequireAuth()
  const sellerKey = marketplaceKeys.sellers.detail(sellerId)
  const listingDetailsKey = [...marketplaceKeys.listings.all, "detail"] as const

  const withFollowState = (follow: boolean) => (old: ListingDetail | undefined) =>
    old?.seller?.id === sellerId ? { ...old, seller: { ...old.seller, isFollowing: follow } } : old

  const mutation = useMutation({
    mutationFn: (follow: boolean) => (follow ? followSeller(sellerId) : unfollowSeller(sellerId)),
    onMutate: async (follow) => {
      await queryClient.cancelQueries({ queryKey: sellerKey })
      await queryClient.cancelQueries({ queryKey: listingDetailsKey })

      const previousSeller = queryClient.getQueryData<FollowableSeller>(sellerKey)
      const previousListings = queryClient.getQueriesData<ListingDetail>({ queryKey: listingDetailsKey })

      queryClient.setQueryData<FollowableSeller>(sellerKey, (old) => (old ? { ...old, isFollowing: follow } : old))
      queryClient.setQueriesData<ListingDetail>({ queryKey: listingDetailsKey }, withFollowState(follow))
      return { previousSeller, previousListings }
    },
    onError: (err, _follow, context) => {
      if (context?.previousSeller) queryClient.setQueryData(sellerKey, context.previousSeller)
      for (const [key, data] of context?.previousListings ?? []) queryClient.setQueryData(key, data)
      toast.error(describeError(err, "Couldn't update follow. Please try again."))
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: sellerKey })
      void queryClient.invalidateQueries({ queryKey: listingDetailsKey })
    },
  })

  return {
    toggle: (currentlyFollowing: boolean) => requireAuth(() => mutation.mutate(!currentlyFollowing)),
    isPending: mutation.isPending,
  }
}
