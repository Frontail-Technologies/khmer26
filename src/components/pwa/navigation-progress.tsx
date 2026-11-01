"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type Phase = "idle" | "loading" | "done"

function isInternalNavigation(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target !== "_self") return false
  if (anchor.hasAttribute("download")) return false
  const href = anchor.getAttribute("href")
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false

  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return false
  // Same page (or hash-only change): nothing will load.
  return url.pathname !== window.location.pathname || url.search !== window.location.search
}

/**
 * Thin top progress bar for client navigations. Starts on an internal link tap and finishes once the
 * new route commits, so even a slow network response gives immediate feedback.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [phase, setPhase] = useState<Phase>("idle")
  const safety = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a")
      if (!anchor || !isInternalNavigation(anchor, event)) return
      setPhase("loading")
      window.clearTimeout(safety.current)
      // Never leave the bar hanging if a navigation is cancelled or blocked.
      safety.current = window.setTimeout(() => setPhase("done"), 10_000)
    }
    // Capture so this runs even if a handler later stops propagation.
    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.clearTimeout(safety.current)
    }
  }, [])

  // The route committed: finish the bar. Tracks an external system (the router), hence the effect.
  useEffect(() => {
    window.clearTimeout(safety.current)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase((current) => (current === "loading" ? "done" : current))
  }, [pathname, searchParams])

  useEffect(() => {
    if (phase !== "done") return
    const timer = window.setTimeout(() => setPhase("idle"), 350)
    return () => window.clearTimeout(timer)
  }, [phase])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      style={{ viewTransitionName: "nav-progress" }}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary via-primary to-accent shadow-[0_0_8px_var(--color-primary)]"
        style={{
          transform: phase === "idle" ? "scaleX(0)" : phase === "loading" ? "scaleX(0.85)" : "scaleX(1)",
          opacity: phase === "done" ? 0 : phase === "idle" ? 0 : 1,
          transition:
            phase === "loading"
              ? "transform 8s cubic-bezier(0.05, 0.8, 0.1, 1), opacity 120ms"
              : phase === "done"
                ? "transform 200ms ease-out, opacity 300ms ease 150ms"
                : "none",
        }}
      />
    </div>
  )
}
