"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Export, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "k26:install-dismissed-at"
/** Cookie mirror of the dismissal: survives where localStorage is blocked (private mode, in-app browsers). */
const DISMISS_COOKIE = "k26_install_dismissed"
const DISMISS_DAYS = 14
const DISMISS_MS = DISMISS_DAYS * 24 * 60 * 60 * 1000
/** Ask only after the visitor has had a moment with the site, never on first paint. */
const SHOW_DELAY_MS = 20_000

/** Covers this page view even if both storages fail. */
let dismissedThisSession = false

/** Test hook: simulate a new page load (the session flag lives in module memory). */
export function resetInstallPromptSessionForTests() {
  dismissedThisSession = false
}

function dismissedAt(): number {
  let at = 0
  try {
    at = Number(window.localStorage.getItem(DISMISS_KEY)) || 0
  } catch {
    // Storage blocked; fall back to the cookie below.
  }
  const cookie = document.cookie.match(new RegExp(`(?:^|; )${DISMISS_COOKIE}=(\\d+)`))
  return Math.max(at, cookie ? Number(cookie[1]) : 0)
}

function recentlyDismissed(): boolean {
  return dismissedThisSession || Date.now() - dismissedAt() < DISMISS_MS
}

function rememberDismissal() {
  dismissedThisSession = true
  const now = String(Date.now())
  try {
    window.localStorage.setItem(DISMISS_KEY, now)
  } catch {
    // Storage can be unavailable; the cookie and session flag still hold it.
  }
  document.cookie = `${DISMISS_COOKIE}=${now}; path=/; max-age=${DISMISS_DAYS * 24 * 60 * 60}; samesite=lax`
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  return isIos && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua)
}

/** Mobile-only "add to home screen" card; native prompt on Android/Chromium, instructions on iOS. */
export function InstallPrompt() {
  const t = useTranslations("pwa")
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [mode, setMode] = useState<"native" | "ios" | null>(null)

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return
    if (!window.matchMedia("(max-width: 767px)").matches) return

    let timer: number | undefined
    // Browsers may fire beforeinstallprompt more than once per visit; re-check the dismissal every
    // time (and again when the delay ends) so a closed card never comes back.
    const showLater = (next: "native" | "ios") => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!recentlyDismissed() && !isStandalone()) setMode(next)
      }, SHOW_DELAY_MS)
    }
    const onPrompt = (event: Event) => {
      event.preventDefault()
      if (recentlyDismissed()) return
      setDeferred(event as BeforeInstallPromptEvent)
      showLater("native")
    }
    const onInstalled = () => {
      rememberDismissal()
      setMode(null)
    }

    window.addEventListener("beforeinstallprompt", onPrompt)
    window.addEventListener("appinstalled", onInstalled)
    if (isIosSafari()) showLater("ios")

    return () => {
      if (timer) window.clearTimeout(timer)
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  if (!mode) return null

  const dismiss = () => {
    rememberDismissal()
    setMode(null)
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice.catch(() => null)
    setDeferred(null)
    dismiss()
  }

  return (
    <div
      role="dialog"
      aria-labelledby="k26-install-title"
      className="fixed inset-x-3 z-[60] animate-in slide-in-from-bottom-6 fade-in duration-300 md:hidden bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)+0.75rem)]"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-xl backdrop-blur-md">
        <Image src="/icons/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl border border-border/60" />
        <div className="min-w-0 flex-1">
          <p id="k26-install-title" className="text-sm font-bold text-foreground">{t("installTitle")}</p>
          <p className="text-xs leading-snug text-muted-foreground">
            {mode === "ios" ? (
              <>
                <Export size={13} weight="bold" className="mr-1 inline align-[-2px]" aria-hidden="true" />
                {t("installIosBody")}
              </>
            ) : (
              t("installBody")
            )}
          </p>
        </div>
        {mode === "native" && (
          <Button size="sm" className="shrink-0 rounded-full px-4 font-bold" onClick={install}>
            {t("installAction")}
          </Button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
        >
          <X size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
