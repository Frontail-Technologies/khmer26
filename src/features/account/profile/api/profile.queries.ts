"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authKeys, customerKeys, marketplaceKeys } from "@/lib/query/keys"
import {
  getAccountProfile,
  getMyVerification,
  getPostingEligibility,
  saveAccountProfile,
  submitVerification,
  type SaveProfileInput,
} from "./profile.api"

export function useAccountProfile() {
  return useQuery({
    queryKey: customerKeys.profile,
    queryFn: getAccountProfile,
    staleTime: 60_000,
  })
}

export function useSaveAccountProfile(profileId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveProfileInput) => saveAccountProfile(profileId, input),
    onSuccess: async (profile) => {
      queryClient.setQueryData(customerKeys.profile, (current: Awaited<ReturnType<typeof getAccountProfile>> | undefined) =>
        current ? { ...current, sellerProfile: profile } : current
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authKeys.session() }),
        queryClient.invalidateQueries({ queryKey: marketplaceKeys.sellers.all }),
        queryClient.invalidateQueries({ queryKey: customerKeys.verification }),
        queryClient.invalidateQueries({ queryKey: customerKeys.postingEligibility }),
      ])
    },
  })
}

export function useMyVerification(enabled: boolean) {
  return useQuery({
    queryKey: customerKeys.verification,
    queryFn: getMyVerification,
    enabled,
    staleTime: 30_000,
  })
}

export function usePostingEligibility() {
  return useQuery({
    queryKey: customerKeys.postingEligibility,
    queryFn: getPostingEligibility,
    staleTime: 30_000,
  })
}

export function useSubmitVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitVerification,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKeys.verification }),
        queryClient.invalidateQueries({ queryKey: customerKeys.postingEligibility }),
      ])
    },
  })
}
