"use client"

import { useTranslations } from "next-intl"
import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { customerKeys, marketplaceKeys } from "@/lib/query/keys"
import { ApiError } from "@/lib/api/client"
import { addFavorite, removeFavorite } from "../api/listing-detail.api"
import { patchFavoriteInData } from "../lib/favorite-cache"

function applyFavorite(queryClient: QueryClient, listingId: string, favorited: boolean) {
  queryClient.setQueriesData({ queryKey: marketplaceKeys.all }, (data) =>
    patchFavoriteInData(data, listingId, favorited)
  )
}

/** Optimistic favorite toggle that updates every cached copy of the listing and rolls back on failure. */
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const t = useTranslations("ui.listings")

  return useMutation({
    mutationFn: ({ listingId, favorited }: { listingId: string; favorited: boolean }) =>
      favorited ? addFavorite(listingId) : removeFavorite(listingId),
    onMutate: ({ listingId, favorited }) => {
      applyFavorite(queryClient, listingId, favorited)
    },
    onError: (err, { listingId, favorited }) => {
      applyFavorite(queryClient, listingId, !favorited)
      toast.error(err instanceof ApiError ? err.message : t("favoriteFailed"))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.favorites.all })
    },
  })
}
