"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

/**
 * Registers /sw.js in production and offers a one-tap refresh when a new deploy is waiting.
 * Development never registers a worker (and removes a stale one) so HMR is never served from cache.
 */
export function ServiceWorkerRegistrar() {
  const t = useTranslations("pwa")

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.unregister())).catch(() => {})
      return
    }

    let refreshing = false
    const onControllerChange = () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    }

    const promptUpdate = (worker: ServiceWorker) => {
      toast(t("updateReady"), {
        duration: Infinity,
        action: {
          label: t("updateAction"),
          onClick: () => worker.postMessage({ type: "SKIP_WAITING" }),
        },
      })
    }

    let cancelled = false
    let interval: number | undefined

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
        if (cancelled) return

        // A worker that was already waiting from a previous visit.
        if (registration.waiting && navigator.serviceWorker.controller) {
          promptUpdate(registration.waiting)
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing
          if (!installing) return
          installing.addEventListener("statechange", () => {
            // Only prompt on updates: the very first install has no controller and activates silently.
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              promptUpdate(installing)
            }
          })
        })

        // Long-lived installed sessions should still pick up deploys.
        interval = window.setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000)
      } catch {
        // Registration failures (private mode, blocked storage) must never break the page.
      }
    }

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange)
    // Defer until the page is idle so registration never competes with first paint.
    if (document.readyState === "complete") {
      void register()
    } else {
      window.addEventListener("load", register, { once: true })
    }

    return () => {
      cancelled = true
      if (interval) window.clearInterval(interval)
      window.removeEventListener("load", register)
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange)
    }
  }, [t])

  return null
}
