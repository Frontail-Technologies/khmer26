import * as React from "react"
import { cn } from "@/lib/utils"

interface AccountPageHeaderProps {
  title: string
  action?: React.ReactNode
  className?: string
}

export function AccountPageHeader({
  title,
  action,
  className,
}: AccountPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:pb-6 lg:border-b lg:border-border/70",
        !action && "max-lg:hidden",
        className
      )}
    >
      {/* On phones the sticky account app bar already shows the title. */}
      <div className="max-lg:sr-only">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
