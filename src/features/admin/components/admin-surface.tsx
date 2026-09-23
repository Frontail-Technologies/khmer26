import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AdminSurfaceProps {
  children: ReactNode
  className?: string
}

export function AdminSurface({ children, className }: AdminSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card shadow-2xs overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  )
}
