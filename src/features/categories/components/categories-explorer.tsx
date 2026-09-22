"use client"

import { useState, useMemo } from "react"
import {
  MagnifyingGlass,
  X,
  Sparkle,
} from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VisualCategoryGrid } from "./visual-category-grid"
import { CategoryPostAdCta } from "./category-post-ad-cta"
import type { DetailedCategory } from "../data/all-categories"

interface CategoriesExplorerProps {
  categories: DetailedCategory[]
}

export function CategoriesExplorer({ categories }: CategoriesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const totalListings = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.listingCount, 0)
  }, [categories])

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (selectedFilter !== "all" && cat.slug !== selectedFilter && cat.id !== selectedFilter) {
        return false
      }

      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase().trim()

      const matchesName = cat.name.toLowerCase().includes(query)
      const matchesDescription = cat.description.toLowerCase().includes(query)
      const matchesSubcategories = cat.subcategories.some(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          (sub.children && sub.children.some((leaf) => leaf.name.toLowerCase().includes(query)))
      )
      const matchesTags = cat.featuredTags.some((tag) => tag.toLowerCase().includes(query))

      return matchesName || matchesDescription || matchesSubcategories || matchesTags
    })
  }, [categories, selectedFilter, searchQuery])

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight">
                All Marketplace Categories
              </h1>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary font-bold text-xs px-2.5 py-0.5 rounded-full"
              >
                {totalListings.toLocaleString()}+ ads
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Browse verified classified listings across 12 major categories in Cambodia
            </p>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="search"
            placeholder="Search categories (e.g. Cars, Properties, Phones, Electronics, Jobs, Furniture)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9 h-11 text-xs sm:text-sm bg-background rounded-xl border-border/80 focus-visible:ring-primary/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedFilter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Categories ({categories.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFilter(cat.id === selectedFilter ? "all" : cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedFilter === cat.id
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
          <span>
            Found <strong>{filteredCategories.length}</strong> categories matching &quot;{searchQuery}&quot;
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <MagnifyingGlass size={24} />
          </div>
          <h3 className="text-base font-bold text-foreground">No matching categories</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find any categories matching &quot;{searchQuery}&quot;. Try searching with a broader keyword or browse all categories.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setSelectedFilter("all")
            }}
            className="font-bold text-xs rounded-xl"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkle size={18} className="text-primary" weight="fill" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Browse Categories
                </h2>
              </div>
            </div>

            <VisualCategoryGrid categories={filteredCategories} />
          </section>

          <CategoryPostAdCta />
        </div>
      )}
    </div>
  )
}
