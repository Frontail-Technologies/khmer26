import type { ReactNode } from "react"
import { QueryProvider } from "./QueryProvider"
import { ThemeProvider } from "./ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider delay={300}>
          {children}
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
