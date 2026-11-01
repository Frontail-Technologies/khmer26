import { apiClient } from "@/lib/api/client"

export interface PushPublicKey {
  enabled: boolean
  publicKey: string | null
}

export async function getPushPublicKey(): Promise<PushPublicKey> {
  const response = await apiClient.get<PushPublicKey>("/push/public-key")
  return response.data
}

export async function savePushSubscription(subscription: PushSubscription, locale: string): Promise<void> {
  const json = subscription.toJSON()
  await apiClient.post("/push/subscriptions", {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
    locale: locale === "en" ? "en" : "km",
  })
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await apiClient.delete("/push/subscriptions", { body: { endpoint } })
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = window.atob(base64)
  const output = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i)
  return output
}

export function isPushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
}

export function isIosWithoutInstall(): boolean {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return isIos && !standalone
}

async function currentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  const registration = await navigator.serviceWorker.getRegistration()
  return (await registration?.pushManager.getSubscription()) ?? null
}

/** Removes this device's subscription on the server and in the browser. Best-effort (used on logout). */
export async function unsubscribeThisDevice(): Promise<void> {
  const subscription = await currentSubscription()
  if (!subscription) return
  await Promise.race([
    deletePushSubscription(subscription.endpoint).catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ])
  await subscription.unsubscribe().catch(() => false)
}

export { currentSubscription }
