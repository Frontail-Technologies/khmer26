"use client"

import { Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategoryTree } from "../api/categories.queries"
import { VisualCategoryGrid } from "./visual-category-grid"
import { CategoryPostAdCta } from "./category-post-ad-cta"

export function CategoriesExplorer() {
  const tree = useCategoryTree()
  const categories = tree.data ?? []

  return (
    <div className="space-y-8 sm:space-y-10">
      {tree.isPending ? (
        <div
          aria-busy="true"
          aria-label="Loading categories"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : tree.isError ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <h1 className="text-base font-bold text-foreground">We couldn&apos;t load the categories</h1>
          <p className="text-xs text-muted-foreground">Please check your connection and try again.</p>
          <Button size="sm" onClick={() => tree.refetch()} className="font-bold text-xs rounded-xl">
            Try again
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <h1 className="text-base font-bold text-foreground">No categories yet</h1>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkle size={18} className="text-primary" weight="fill" />
              <h1 className="text-base sm:text-lg font-bold text-foreground">Browse Categories</h1>
            </div>

            <VisualCategoryGrid categories={categories} />
          </section>

          <CategoryPostAdCta />
        </div>
      )}
    </div>
  )
}
