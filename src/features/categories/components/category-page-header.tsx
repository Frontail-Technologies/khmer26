import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react/dist/ssr"
import { formatAdCount } from "@/features/search/lib/format-count"

interface CategoryPageHeaderProps {
  title: string
  breadcrumbs: { label: string; href?: string }[]
  totalCount?: number
}

export function CategoryPageHeader({ title, breadcrumbs, totalCount }: CategoryPageHeaderProps) {
  return (
    <div className="pb-3 pt-2 mb-2 border-b border-border/70">
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <li key={`${idx}-${crumb.label}`} className="inline-flex items-center gap-1.5">
                {idx > 0 && (
                  <CaretRight size={11} className="text-muted-foreground/60 shrink-0" />
                )}
                {isLast || !crumb.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="font-semibold text-foreground truncate max-w-50 sm:max-w-none"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-foreground">
          {title}
        </h1>
        {totalCount !== undefined && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] sm:text-xs font-bold text-primary shrink-0">
            {formatAdCount(totalCount)}
          </span>
        )}
      </div>
    </div>
  )
}
