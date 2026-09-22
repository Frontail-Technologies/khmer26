"use client"

import { useState } from "react"
import {
  Car,
  Buildings,
  DeviceMobile,
  Laptop,
  Armchair,
  TShirt,
  Briefcase,
  Wrench,
  Dog,
  DotsThreeCircle,
  CaretRight,
  ArrowLeft,
  CheckCircle,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DEMO_CATEGORIES } from "@/features/categories/data/demo-categories"
import type { Category } from "@/types"

interface CategoryStepProps {
  selectedCategoryId: string
  selectedCategorySlug: string
  selectedCategoryPath: string[]
  onSelect: (category: { id: string; slug: string; path: string[] }) => void
}

function getCategoryIcon(slug: string) {
  const iconProps = { size: 24, weight: "duotone" as const }
  switch (slug) {
    case "vehicles": return <Car {...iconProps} />
    case "property": return <Buildings {...iconProps} />
    case "electronics": return <Laptop {...iconProps} />
    case "phones": return <DeviceMobile {...iconProps} />
    case "furniture": return <Armchair {...iconProps} />
    case "fashion": return <TShirt {...iconProps} />
    case "jobs": return <Briefcase {...iconProps} />
    case "services": return <Wrench {...iconProps} />
    case "pets": return <Dog {...iconProps} />
    default: return <DotsThreeCircle {...iconProps} />
  }
}

export function CategoryStep({
  selectedCategoryId,
  selectedCategoryPath,
  onSelect,
}: CategoryStepProps) {
  const [activeParent, setActiveParent] = useState<Category | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<Category | null>(null)

  const handleParentClick = (cat: Category) => {
    if (cat.children && cat.children.length > 0) {
      setActiveParent(cat)
      setActiveSubcategory(null)
    } else {
      onSelect({
        id: cat.id,
        slug: cat.slug,
        path: [cat.name],
      })
    }
  }

  const handleSubcategoryClick = (sub: Category) => {
    if (sub.children && sub.children.length > 0) {
      setActiveSubcategory(sub)
    } else if (activeParent) {
      onSelect({
        id: sub.id,
        slug: sub.slug,
        path: [activeParent.name, sub.name],
      })
    }
  }

  const handleLeafClick = (leaf: Category) => {
    if (activeParent && activeSubcategory) {
      onSelect({
        id: leaf.id,
        slug: leaf.slug,
        path: [activeParent.name, activeSubcategory.name, leaf.name],
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {activeSubcategory
              ? `Select subcategory in ${activeSubcategory.name}`
              : activeParent
              ? `Select subcategory in ${activeParent.name}`
              : "Choose a Category"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select the category that best describes your item
          </p>
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
            <span>Back</span>
          </Button>
        )}
      </div>

      {selectedCategoryPath.length > 0 && !activeParent && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <CheckCircle size={16} weight="fill" />
            <span>Selected: {selectedCategoryPath.join(" > ")}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveParent(null)
              setActiveSubcategory(null)
            }}
            className="font-bold text-primary hover:underline cursor-pointer"
          >
            Change
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
                <span>{leaf.name}</span>
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
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {getCategoryIcon(sub.slug)}
                  </div>
                  <span>{sub.name}</span>
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
          {DEMO_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryPath[0] === cat.name

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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {cat.name}
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
