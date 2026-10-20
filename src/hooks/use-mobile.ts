"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const subscribe = React.useCallback((callback: () => void) => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    }

    // Safari before 14 exposes only the legacy MediaQueryList listener API.
    mql.addListener(callback)
    return () => mql.removeListener(callback)
  }, [])

  return React.useSyncExternalStore(
    subscribe,
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
