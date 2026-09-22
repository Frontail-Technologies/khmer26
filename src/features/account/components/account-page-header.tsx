import * as React from "react"
import { cn } from "cn"

interface AccountPageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function AccountPageHeader({
  title,
  description,
  action,
  className,
}: AccountPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-6 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
