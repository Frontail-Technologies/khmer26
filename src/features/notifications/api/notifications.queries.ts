"use client"

import { useTranslations } from "next-intl"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customerKeys } from "@/lib/query/keys"
import * as api from "./notifications.api"
import { toast } from "sonner"

export function useNotifications(page = 1, unreadOnly = false, limit = 20, enabled = true) {
  return useQuery({
    queryKey: customerKeys.notifications.list({ page, unreadOnly, limit }),
    queryFn: () => api.getNotifications(page, unreadOnly, limit),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useUnreadNotificationCount(enabled = true) {
  return useQuery({
    queryKey: customerKeys.notifications.unread(),
    queryFn: api.getUnreadNotificationCount,
    enabled,
    refetchInterval: 60_000,
  })
}

function useReadMutation<T>(mutationFn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.notifications.all }),
  })
}

export const useMarkNotificationRead = () => useReadMutation(api.markNotificationRead)
export const useMarkAllNotificationsRead = () => useReadMutation(() => api.markAllNotificationsRead())

export function useNotificationPreferences() {
  return useQuery({
    queryKey: customerKeys.notifications.preferences(),
    queryFn: api.getNotificationPreferences,
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  const t = useTranslations("ui.settingsToasts")
  return useMutation({
    mutationFn: api.updateNotificationPreferences,
    onMutate: async (changes) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.notifications.preferences() })
      const previous = queryClient.getQueryData<api.NotificationPreferences>(customerKeys.notifications.preferences())
      if (previous) queryClient.setQueryData(customerKeys.notifications.preferences(), { ...previous, ...changes })
      return { previous }
    },
    onError: (_error, _changes, context) => {
      if (context?.previous) queryClient.setQueryData(customerKeys.notifications.preferences(), context.previous)
      toast.error(t("notificationPrefsFailed"))
    },
    onSuccess: (preferences) => queryClient.setQueryData(customerKeys.notifications.preferences(), preferences),
  })
}
