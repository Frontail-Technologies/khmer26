import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"

interface MobilePageHeaderProps {
  title?: string
  backHref: string
  backLabel?: string
  action?: ReactNode
  className?: string
}

export function MobilePageHeader({
  title,
  backHref,
  backLabel = "Back",
  action,
  className,
}: MobilePageHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-full items-center justify-between gap-2 border-b border-border/70 bg-card/90 px-3 backdrop-blur-md md:hidden sticky top-0 z-30",
        className
      )}
    >
      <Link
        href={backHref}
        aria-label={backLabel}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted active:scale-95 shrink-0"
      >
        <ArrowLeft size={20} weight="bold" />
        <span className="sr-only">{backLabel}</span>
      </Link>

      {title && (
        <h1 className="flex-1 truncate text-center text-sm font-bold text-foreground">
          {title}
        </h1>
      )}

      <div className="flex min-w-10 items-center justify-end shrink-0">
        {action || <div className="w-10" aria-hidden="true" />}
      </div>
    </div>
  )
}
