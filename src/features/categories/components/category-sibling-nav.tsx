"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ResolvedCategoryTaxonomy } from "../lib/category-taxonomy"

interface CategorySiblingNavProps {
  taxonomy: ResolvedCategoryTaxonomy
  className?: string
}

export function CategorySiblingNav({ taxonomy, className }: CategorySiblingNavProps) {
  const { rootCategory, currentSubcategory, siblingSubcategories } = taxonomy

  if (siblingSubcategories.length === 0) {
    return null
  }

  const isAllActive = !currentSubcategory

  return (
    <div className={cn("w-full pb-3 pt-1", className)}>
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
        <Link
          href={`/category/${rootCategory.slug}`}
          className={cn(
            "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 font-medium",
            isAllActive
              ? "bg-primary text-primary-foreground font-bold shadow-2xs"
              : "border border-border/80 bg-card text-foreground hover:bg-muted hover:border-primary/40"
          )}
        >
          All {rootCategory.name.split(" ")[0]}
        </Link>

        {siblingSubcategories.map((sub) => (
          <Link
            key={sub.slug}
            href={sub.href}
            className={cn(
              "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 font-medium",
              sub.isActive
                ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                : "border border-border/80 bg-card text-foreground hover:bg-muted hover:border-primary/40"
            )}
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
