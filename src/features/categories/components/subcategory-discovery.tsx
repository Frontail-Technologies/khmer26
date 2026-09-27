"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CaretDown, CaretUp, ArrowUpRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { ResolvedCategoryTaxonomy } from "../lib/category-taxonomy"

interface SubcategoryDiscoveryProps {
  taxonomy: ResolvedCategoryTaxonomy
  className?: string
}

const INITIAL_VISIBLE_COUNT = 8

export function SubcategoryDiscovery({ taxonomy, className }: SubcategoryDiscoveryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const items = taxonomy.siblingSubcategories

  if (items.length === 0) {
    return null
  }

  const hasMany = items.length > INITIAL_VISIBLE_COUNT
  const visibleItems = isExpanded || !hasMany ? items : items.slice(0, INITIAL_VISIBLE_COUNT)

  return (
    <section className={cn("space-y-3 pb-4 sm:pb-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm sm:text-base font-bold text-foreground">
          Browse by Subcategory
        </h2>
        {hasMany && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? "Show fewer" : `View all (${items.length})`}</span>
            {isExpanded ? <CaretUp size={13} weight="bold" /> : <CaretDown size={13} weight="bold" />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
        {visibleItems.map((sub) => (
          <Link
            key={sub.slug}
            href={sub.href}
            className="group block focus-visible:outline-hidden"
          >
            <div className="flex flex-col h-full rounded-xl border border-border/80 bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                {sub.imageUrl ? (
                  <Image
                    src={sub.imageUrl}
                    alt={sub.name}
                    fill
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground/50 text-xs" />
                )}
              </div>

              <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {sub.name}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 -translate-x-0.5 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-primary shrink-0 mt-0.5"
                    weight="bold"
                  />
                </div>

                {sub.listingCount > 0 && (
                  <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                    {sub.listingCount.toLocaleString()} ads
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
