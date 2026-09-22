import { cn } from "@/lib/utils"
import type { ListingCard as ListingCardType } from "@/types"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import type { ReactNode } from "react"
import { ListingGrid } from "./listing-grid"

interface ListingSectionProps {
  title: string
  description?: string
  icon?: ReactNode
  viewAllHref?: string
  listings: ListingCardType[]
  featured?: boolean
  className?: string
}

export function ListingSection({
  title,
  description,
  icon,
  viewAllHref = "/search",
  listings,
  featured = false,
  className,
}: ListingSectionProps) {
  return (
    <section className={cn("py-3 sm:py-4", className)}>
      <div className="flex items-end justify-between gap-4 pb-2.5 sm:pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            {icon && <span className="shrink-0">{icon}</span>}
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>

      <ListingGrid listings={listings} featured={featured} />
    </section>
  )
}
