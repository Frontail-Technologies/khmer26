import type { ReactNode } from "react"
import { QueryProvider } from "./QueryProvider"
import { ThemeProvider } from "./ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import type { DehydratedState } from "@tanstack/react-query"

export function AppProviders({
  children,
  dehydratedState,
}: {
  children: ReactNode
  dehydratedState?: DehydratedState
}) {
  return (
    <ThemeProvider>
      <QueryProvider dehydratedState={dehydratedState}>
        <TooltipProvider delay={300}>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
