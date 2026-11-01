"use client"

import { useEffect, useRef, useState } from "react"
import { useOffline } from "next/offline"
import { useTranslations } from "next-intl"
import { CloudSlash, WifiHigh } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

/** Slim pill that slides in when the connection drops and confirms briefly when it returns. */
export function ConnectivityBanner() {
  const t = useTranslations("pwa")
  const isOffline = useOffline()
  const wasOffline = useRef(false)
  const [showBackOnline, setShowBackOnline] = useState(false)

  useEffect(() => {
    if (isOffline) {
      wasOffline.current = true
      return
    }
    if (!wasOffline.current) return
    wasOffline.current = false
    // Brief confirmation after a reconnect.
    setShowBackOnline(true)
    const timer = window.setTimeout(() => setShowBackOnline(false), 2500)
    return () => window.clearTimeout(timer)
  }, [isOffline])

  const visible = isOffline || showBackOnline

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-4 transition-all duration-300 ease-out",
        "top-[calc(env(safe-area-inset-top,0px)+0.75rem)]",
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      )}
    >
      {visible && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-md",
            isOffline ? "bg-foreground/90 text-background" : "bg-success/95 text-success-foreground"
          )}
        >
          {isOffline ? <CloudSlash size={16} weight="bold" aria-hidden="true" /> : <WifiHigh size={16} weight="bold" aria-hidden="true" />}
          {isOffline ? t("offline") : t("backOnline")}
        </div>
      )}
    </div>
  )
}
