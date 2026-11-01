import { ViewTransition, type ReactNode } from "react"

/**
 * Wraps a route segment so navigations fade/lift the page in and out (browser View Transitions API).
 * Used from template.tsx, which remounts per navigation so enter/exit fire. Browsers without support
 * simply swap instantly.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  )
}
