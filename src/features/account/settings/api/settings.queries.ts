"use client"

import { useTranslations } from "next-intl"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { customerKeys, marketplaceKeys } from "@/lib/query/keys"
import * as api from "./settings.api"

export function usePrivacyPreferences() {
  return useQuery({ queryKey: customerKeys.privacy, queryFn: api.getPrivacyPreferences })
}

export function useUpdatePrivacyPreferences() {
  const queryClient = useQueryClient()
  const t = useTranslations("ui.account")
  return useMutation({
    mutationFn: api.updatePrivacyPreferences,
    onMutate: async (changes) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.privacy })
      const previous = queryClient.getQueryData<api.PrivacyPreferences>(customerKeys.privacy)
      if (previous) queryClient.setQueryData(customerKeys.privacy, { ...previous, ...changes })
      return { previous }
    },
    onError: (_error, _changes, context) => {
      if (context?.previous) queryClient.setQueryData(customerKeys.privacy, context.previous)
      toast.error(t("privacyUpdateFailed"))
    },
    onSuccess: async (preferences) => {
      queryClient.setQueryData(customerKeys.privacy, preferences)
      await queryClient.invalidateQueries({ queryKey: marketplaceKeys.sellers.all })
    },
  })
}

export function useAccountSessions() {
  return useQuery({ queryKey: customerKeys.sessions, queryFn: api.getAccountSessions })
}

export function useRevokeAccountSession() {
  const queryClient = useQueryClient()
  const t = useTranslations("ui.account")
  return useMutation({
    mutationFn: api.revokeAccountSession,
    onSuccess: async () => {
      toast.success(t("sessionSignedOut"))
      await queryClient.invalidateQueries({ queryKey: customerKeys.sessions })
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("sessionSignOutFailed")),
  })
}

export function useLogoutOtherSessions() {
  const queryClient = useQueryClient()
  const t = useTranslations("ui.account")
  return useMutation({
    mutationFn: api.logoutOtherSessions,
    onSuccess: async () => {
      toast.success(t("otherSessionsSignedOut"))
      await queryClient.invalidateQueries({ queryKey: customerKeys.sessions })
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("sessionsSignOutFailed")),
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      api.changePassword(currentPassword, newPassword),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.sessions }),
  })
}

export function useAuthenticationMethods() {
  return useQuery({ queryKey: [...customerKeys.sessions, "authentication-methods"], queryFn: api.getAuthenticationMethods })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: api.deleteAccount,
    onSuccess: () => {
      queryClient.clear()
      router.replace("/")
      router.refresh()
    },
  })
}
