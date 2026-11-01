"use client"

import { useCallback, useEffect, useState } from "react"
import { useLocale } from "next-intl"
import {
  currentSubscription,
  deletePushSubscription,
  getPushPublicKey,
  isIosWithoutInstall,
  isPushSupported,
  savePushSubscription,
  urlBase64ToUint8Array,
} from "./push.api"

export type PushStatus =
  | "loading"
  | "unsupported" // browser has no Push API
  | "ios-install" // iOS Safari: push only works from the installed Home Screen app
  | "unavailable" // server has no VAPID keys configured
  | "blocked" // user denied permission
  | "off"
  | "on"

export function usePushNotifications() {
  const locale = useLocale()
  const [status, setStatus] = useState<PushStatus>("loading")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    const resolve = async (): Promise<PushStatus> => {
      if (isIosWithoutInstall()) return "ios-install"
      if (!isPushSupported()) return "unsupported"
      const { enabled } = await getPushPublicKey().catch(() => ({ enabled: false }))
      if (!enabled) return "unavailable"
      if (Notification.permission === "denied") return "blocked"
      return (await currentSubscription()) && Notification.permission === "granted" ? "on" : "off"
    }
    void resolve().then((next) => {
      if (!cancelled) setStatus(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const enable = useCallback(async () => {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "blocked" : "off")
        return false
      }
      const { publicKey } = await getPushPublicKey()
      if (!publicKey) {
        setStatus("unavailable")
        return false
      }
      const registration = await navigator.serviceWorker.ready
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }))
      await savePushSubscription(subscription, locale)
      setStatus("on")
      return true
    } finally {
      setBusy(false)
    }
  }, [locale])

  const disable = useCallback(async () => {
    setBusy(true)
    try {
      const subscription = await currentSubscription()
      if (subscription) {
        await deletePushSubscription(subscription.endpoint).catch(() => {})
        await subscription.unsubscribe().catch(() => false)
      }
      setStatus("off")
    } finally {
      setBusy(false)
    }
  }, [])

  return { status, busy, enable, disable }
}
