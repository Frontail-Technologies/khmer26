"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MagnifyingGlass,
  Plus,
  CaretRight,
  CaretDown,
  Folder,
  Sliders,
  PencilSimple,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateCategoryDialog } from "./create-category-dialog"
import type { AdminCategoryItem } from "../types"

interface CategoryTreeListProps {
  categories: AdminCategoryItem[]
}

export function CategoryTreeList({ categories }: CategoryTreeListProps) {
  const [search, setSearch] = useState("")
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addSubParentId, setAddSubParentId] = useState<string>("none")

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const query = search.trim().toLowerCase()

  const filteredCategories = useMemo(() => {
    if (!query) return categories

    const result: AdminCategoryItem[] = []

    for (const cat of categories) {
      const rootMatches =
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)

      const matchingSubs = cat.subcategories.filter(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          sub.slug.toLowerCase().includes(query)
      )

      if (rootMatches) {
        result.push(cat)
      } else if (matchingSubs.length > 0) {
        result.push({
          ...cat,
          subcategories: matchingSubs,
        })
      }
    }

    return result
  }, [categories, query])

  const effectiveExpanded = useMemo(() => {
    if (query) {
      const auto: Record<string, boolean> = {}
      filteredCategories.forEach((cat) => {
        auto[cat.id] = true
      })
      return auto
    }
    return expandedIds
  }, [query, filteredCategories, expandedIds])

  const handleOpenAddSub = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setAddSubParentId(parentId)
    setIsAddDialogOpen(true)
  }

  const handleOpenAddRoot = () => {
    setAddSubParentId("none")
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search categories, subcategories, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleOpenAddRoot}
              className="h-9 px-3.5 text-xs font-bold gap-1.5 rounded-lg cursor-pointer shrink-0"
            >
              <Plus size={14} weight="bold" />
              <span>Add Category</span>
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Folder size={32} weight="duotone" className="mx-auto text-muted-foreground/60" />
              <p className="text-xs font-bold text-foreground">No categories found</p>
              <p className="text-[11px] text-muted-foreground">
                Try searching for a different name or create a new category.
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => {
              const isExpanded = Boolean(effectiveExpanded[category.id])
              const subCount = category.subcategories.length

              return (
                <div key={category.id} className="group/root">
                  <div
                    onClick={() => toggleExpand(category.id)}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:px-4 sm:py-3 hover:bg-muted/30 transition-colors cursor-pointer gap-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                        className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(category.id)
                        }}
                      >
                        {isExpanded ? (
                          <CaretDown size={14} weight="bold" />
                        ) : (
                          <CaretRight size={14} weight="bold" />
                        )}
                      </button>

                      <div className="relative size-10 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/50">
                        {category.imageUrl ? (
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Folder size={18} weight="duotone" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground group-hover/root:text-primary transition-colors">
                            {category.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                            /{category.slug}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate max-w-sm sm:max-w-md">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pl-10 sm:pl-0">
                      <span className="text-[11px] text-muted-foreground font-medium hidden md:inline-block">
                        {subCount} {subCount === 1 ? "subcategory" : "subcategories"}
                      </span>

                      <span className="text-[11px] font-semibold text-foreground/80 px-2 py-0.5 rounded-md bg-muted/60">
                        {category.listingCount.toLocaleString()} ads
                      </span>

                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          category.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          render={<Link href={`/admin/categories/${category.id}`} />}
                          className="h-7 px-2 text-[11px] font-semibold gap-1 rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        >
                          <PencilSimple size={12} weight="bold" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleOpenAddSub(category.id, e)}
                          title="Add subcategory"
                          className="h-7 px-2 text-[11px] font-semibold gap-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
                        >
                          <Plus size={12} weight="bold" />
                          <span className="hidden lg:inline">Sub</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-muted/15 border-t border-border/40 pl-8 sm:pl-12 pr-3.5 sm:pr-4 py-1.5 space-y-1">
                      {category.subcategories.length === 0 ? (
                        <div className="py-3 px-3 text-[11px] text-muted-foreground italic flex items-center justify-between">
                          <span>No subcategories yet.</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleOpenAddSub(category.id, e)}
                            className="h-6 px-2 text-[10px] font-bold text-primary gap-1"
                          >
                            <Plus size={10} weight="bold" />
                            <span>Add first subcategory</span>
                          </Button>
                        </div>
                      ) : (
                        category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-card transition-colors group/sub"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="relative size-7 rounded-md overflow-hidden shrink-0 bg-muted border border-border/50">
                                {sub.imageUrl ? (
                                  <Image
                                    src={sub.imageUrl}
                                    alt={sub.name}
                                    fill
                                    className="object-cover"
                                    sizes="28px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <Folder size={12} weight="duotone" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-foreground group-hover/sub:text-primary transition-colors">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-muted/80 text-muted-foreground">
                                  /{sub.slug}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="text-[10px] text-muted-foreground">
                                {sub.listingCount.toLocaleString()} ads
                              </span>

                              <span
                                className={`size-1.5 rounded-full ${
                                  sub.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                                }`}
                                title={sub.isActive ? "Active" : "Inactive"}
                              />

                              <Button
                                variant="ghost"
                                size="sm"
                                render={<Link href={`/admin/categories/${sub.id}`} />}
                                className="h-6 px-2 text-[10px] font-bold text-muted-foreground hover:text-foreground rounded-md"
                              >
                                <span>Details</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                render={<Link href={`/admin/listing-fields?category=${sub.slug}`} />}
                                className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary/10 rounded-md"
                              >
                                <Sliders size={11} weight="bold" className="mr-1" />
                                <span>Fields</span>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Card>

      <CreateCategoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        parentCategories={categories}
        defaultParentId={addSubParentId}
      />
    </div>
  )
}
