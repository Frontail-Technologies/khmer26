import type { ReactNode } from "react"

/**
 * Fades each route in as it mounts (template.tsx remounts per navigation). A plain CSS animation on
 * the new page only: unlike View Transitions there is no snapshot of the old page, no exit phase and
 * no frozen frame, so taps register immediately and tab switches feel native.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="k26-page-in">{children}</div>
}
