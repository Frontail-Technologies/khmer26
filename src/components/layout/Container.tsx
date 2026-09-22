import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: "default" | "narrow" | "wide"
}

export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8",
        {
          "max-w-350": size === "default",
          "max-w-2xl": size === "narrow",
          "max-w-screen-2xl": size === "wide",
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
