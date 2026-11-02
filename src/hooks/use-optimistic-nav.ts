"use client"

import { useState } from "react"

/**
 * Highlights a tab the instant it is tapped, before the route has loaded, like a native tab bar.
 * The intent is tied to the pathname it was made on, so it clears itself once navigation lands
 * (or if the visitor navigates elsewhere).
 */
export function useOptimisticNav(pathname: string) {
  const [intent, setIntent] = useState<{ href: string; from: string } | null>(null)
  const current = intent && intent.from === pathname ? intent.href : pathname
  return { current, navigate: (href: string) => setIntent({ href, from: pathname }) }
}
