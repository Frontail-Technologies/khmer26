"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { CaretRight, ArrowLeft, CheckCircle } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCategoryTree } from "@/features/categories/api/categories.queries"
import type { CategoryNode } from "@/features/categories/api/categories.api"
import { CategoryThumb } from "@/features/categories/components/category-thumb"
import { useLocalizedName } from "@/lib/i18n/localized"

interface CategoryStepProps {
  selectedCategoryId: string
  selectedCategorySlug: string
  selectedCategoryPath: string[]
  onSelect: (category: { id: string; slug: string; path: string[] }) => void
}

export function CategoryStep({
  selectedCategoryId,
  selectedCategoryPath,
  onSelect,
}: CategoryStepProps) {
  const tDynamic = useTranslations("dynamic")
  const tGenerated = useTranslations("generated")
  const getLocalizedName = useLocalizedName()
  const { data: categories = [], isLoading, isError } = useCategoryTree()
  const [activeParent, setActiveParent] = useState<CategoryNode | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<CategoryNode | null>(null)

  const handleParentClick = (cat: CategoryNode) => {
    if (cat.children && cat.children.length > 0) {
      setActiveParent(cat)
      setActiveSubcategory(null)
    } else {
      onSelect({
        id: cat.id,
        slug: cat.slug,
        path: [getLocalizedName(cat)],
      })
    }
  }

  const handleSubcategoryClick = (sub: CategoryNode) => {
    if (sub.children && sub.children.length > 0) {
      setActiveSubcategory(sub)
    } else if (activeParent) {
      onSelect({
        id: sub.id,
        slug: sub.slug,
        path: [getLocalizedName(activeParent), getLocalizedName(sub)],
      })
    }
  }

  const handleLeafClick = (leaf: CategoryNode) => {
    if (activeParent && activeSubcategory) {
      onSelect({
        id: leaf.id,
        slug: leaf.slug,
        path: [getLocalizedName(activeParent), getLocalizedName(activeSubcategory), getLocalizedName(leaf)],
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {activeSubcategory
              ? tDynamic("selectSubcategoryIn", { name: getLocalizedName(activeSubcategory) })
              : activeParent
              ? tDynamic("selectSubcategoryIn", { name: getLocalizedName(activeParent) })
              : tGenerated("chooseListingCategory")}
          </h2>
        </div>

        {(activeParent || activeSubcategory) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activeSubcategory) {
                setActiveSubcategory(null)
              } else {
                setActiveParent(null)
              }
            }}
            className="h-8 px-2 text-xs font-semibold gap-1 text-primary hover:text-primary"
          >
            <ArrowLeft size={14} weight="bold" />
            <span><LocalizedText id="back" /></span>
          </Button>
        )}
      </div>

      {selectedCategoryPath.length > 0 && !activeParent && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <CheckCircle size={16} weight="fill" />
            <span>{tDynamic("selectedValue", { value: selectedCategoryPath.join(" > ") })}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveParent(null)
              setActiveSubcategory(null)
            }}
            className="font-bold text-primary hover:underline cursor-pointer"
          >
            <LocalizedText id="change" />
          </button>
        </div>
      )}

      {activeSubcategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeSubcategory.children?.map((leaf) => {
            const isSelected = selectedCategoryId === leaf.id

            return (
              <button
                key={leaf.id}
                type="button"
                onClick={() => handleLeafClick(leaf)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                    : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/40 text-foreground font-medium text-xs sm:text-sm"
                }`}
              >
                <span>{getLocalizedName(leaf)}</span>
                {isSelected && <CheckCircle size={16} weight="fill" />}
              </button>
            )
          })}
        </div>
      ) : activeParent ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeParent.children?.map((sub) => {
            const hasChildren = sub.children && sub.children.length > 0
            const isSelected = selectedCategoryId === sub.id

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubcategoryClick(sub)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                    : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/40 text-foreground font-medium text-xs sm:text-sm"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CategoryThumb imageR2Key={sub.imageR2Key} name={getLocalizedName(sub)} size={32} className="rounded-lg" />
                  <span>{getLocalizedName(sub)}</span>
                </div>

                {hasChildren ? (
                  <CaretRight size={16} className="text-muted-foreground" />
                ) : isSelected ? (
                  <CheckCircle size={16} weight="fill" />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {isLoading && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground"><LocalizedText id="loadingCategories_5f7cba" /></p>
          )}
          {isError && (
            <p className="col-span-full py-8 text-center text-sm text-destructive"><LocalizedText id="categoriesCouldNotBeLoadedPleaseTryAgain" /></p>
          )}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id

            return (
              <Card
                key={cat.id}
                onClick={() => handleParentClick(cat)}
                className={`p-3 sm:p-4 cursor-pointer rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                <CardContent className="p-0 flex flex-col items-center text-center space-y-2">
                  <CategoryThumb imageR2Key={cat.imageR2Key} name={getLocalizedName(cat)} size={56} className="rounded-xl" />
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {getLocalizedName(cat)}
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
