"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { currentSubscription, isPushSupported, savePushSubscription } from "./push.api"

/**
 * Once per signed-in session (and on language change), re-sends this device's existing push
 * subscription. The server upserts it, so the account and language stay in sync and a pruned or
 * rotated subscription is restored without asking the user again.
 */
export function PushSync() {
  const { user } = useCurrentUser()
  const locale = useLocale()
  const userId = user?.id

  useEffect(() => {
    if (!userId || !isPushSupported() || Notification.permission !== "granted") return
    const key = `k26:push-sync:${userId}:${locale}`
    try {
      if (window.sessionStorage.getItem(key)) return
    } catch {
      // Storage unavailable: syncing again is harmless.
    }
    const timer = window.setTimeout(async () => {
      const subscription = await currentSubscription().catch(() => null)
      if (!subscription) return
      await savePushSubscription(subscription, locale).catch(() => {})
      try {
        window.sessionStorage.setItem(key, "1")
      } catch {
        // ignore
      }
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [userId, locale])

  return null
}
