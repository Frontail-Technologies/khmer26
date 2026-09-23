import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AdminPageHeaderProps {
  title: string
  description?: string
  badge?: string | number
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  backHref?: string
  backLabel?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  badge,
  badgeVariant = "secondary",
  backHref,
  backLabel = "Back",
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-4 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-0.5 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>{backLabel}</span>
          </Link>
        )}

        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {badge !== undefined && (
            <Badge variant={badgeVariant} className="text-[11px] font-semibold h-5 px-2">
              {badge}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
