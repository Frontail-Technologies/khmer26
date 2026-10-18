"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategoryTree } from "../api/categories.queries"
import { VisualCategoryGrid } from "./visual-category-grid"
import { CategoryPostAdCta } from "./category-post-ad-cta"

export function CategoriesExplorer() {
  const tGenerated = useTranslations("generated")
  const tree = useCategoryTree()
  const categories = tree.data ?? []

  return (
    <div className="space-y-8 sm:space-y-10">
      {tree.isPending ? (
        <div
          aria-busy="true"
          aria-label={tGenerated("loadingCategories_4413ff")}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : tree.isError ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <h1 className="text-base font-bold text-foreground"><LocalizedText id="weCouldnTLoadTheCategories" /></h1>
          <p className="text-xs text-muted-foreground"><LocalizedText id="pleaseCheckYourConnectionAndTryAgain" /></p>
          <Button size="sm" onClick={() => tree.refetch()} className="font-bold text-xs rounded-xl">
            <LocalizedText id="tryAgain" />
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <h1 className="text-base font-bold text-foreground"><LocalizedText id="noCategoriesYet" /></h1>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkle size={18} className="text-primary" weight="fill" />
              <h1 className="text-base sm:text-lg font-bold text-foreground"><LocalizedText id="browseCategories" /></h1>
            </div>

            <VisualCategoryGrid categories={categories} />
          </section>

          <CategoryPostAdCta />
        </div>
      )}
    </div>
  )
}
