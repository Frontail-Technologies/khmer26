import Link from "next/link"
import { ArrowLeft, SquaresFour, Plus } from "@phosphor-icons/react/dist/ssr"
import { buttonVariants } from "@/components/ui/button"

interface CategoryEmptyStateProps {
  parent?: { name: string; href: string }
}

export function CategoryEmptyState({ parent }: CategoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card py-12 sm:py-16 px-6 text-center shadow-2xs">
      <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-muted/60 mb-4 text-muted-foreground/80">
        <SquaresFour size={36} weight="duotone" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
        No listings found in this category.
      </h3>

      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground">
        There are currently no active classified listings in this specific section. You can browse the parent category or be the first to publish an ad.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        {parent && (
          <Link
            href={parent.href}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "font-semibold text-xs h-9 px-3.5 gap-1.5 rounded-lg",
            })}
          >
            <ArrowLeft size={14} />
            <span>View {parent.name}</span>
          </Link>
        )}

        <Link
          href="/categories"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "font-semibold text-xs h-9 px-3.5 gap-1.5 rounded-lg",
          })}
        >
          <SquaresFour size={14} />
          <span>Browse all categories</span>
        </Link>

        <Link
          href="/post-ad"
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "font-semibold text-xs h-9 px-4 gap-1.5 rounded-lg",
          })}
        >
          <Plus size={14} weight="bold" />
          <span>Post an Ad</span>
        </Link>
      </div>
    </div>
  )
}
