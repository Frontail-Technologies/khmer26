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
        "flex flex-col gap-3 pb-6 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
