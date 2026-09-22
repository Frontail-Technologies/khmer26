import type { BreadcrumbItem as BreadcrumbItemType } from "@/features/search/types"
import { CaretRight, CarProfile, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

interface ResultsHeaderProps {
  title: string
  description?: string
  totalCount: number
  breadcrumbs: BreadcrumbItemType[]
}

export function ResultsHeader({
  title,
  totalCount,
  breadcrumbs,
}: ResultsHeaderProps) {
  const isSearch = title.toLowerCase().includes("results for")

  return (
    <div className="border-b border-border/70 pb-3 pt-2 mb-4">
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <li key={crumb.label} className="inline-flex items-center gap-1.5">
                {idx > 0 && (
                  <CaretRight size={11} className="text-muted-foreground/60 shrink-0" />
                )}
                {isLast || !crumb.href ? (
                  <span className="font-semibold text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs">
          {isSearch ? (
            <MagnifyingGlass size={19} weight="bold" />
          ) : (
            <CarProfile size={21} weight="fill" />
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-wrap">
          <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-foreground truncate">
            {title}
          </h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] sm:text-xs font-bold text-primary">
            {totalCount.toLocaleString()} ads
          </span>
        </div>
      </div>
    </div>
  )
}
