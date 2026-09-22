import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 pb-2.5 sm:pb-3", className)}>
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
