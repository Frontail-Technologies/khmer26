"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MagnifyingGlass,
  Plus,
  CaretRight,
  CaretDown,
  DotsThreeVertical,
  Folder,
  Sliders,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"
import { CreateCategoryDialog } from "./create-category-dialog"
import { useAdminCategories } from "../hooks/categories.queries"
import { useDeleteCategory } from "../hooks/categories.mutations"
import type { AdminCategoryItem } from "../types"

interface CategoryTreeListProps {
  categories?: AdminCategoryItem[]
}

function CategoryImage({ url, name, className, iconSize }: { url?: string; name: string; className: string; iconSize: number }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden border border-border/50 bg-muted", className)}>
      {url ? (
        <Image src={url} alt={name} fill sizes="40px" className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <Folder size={iconSize} weight="duotone" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

interface RowMenuProps {
  label: string
  editHref: string
  fieldsHref: string
  onAddSub?: () => void
  onDelete: () => void
}

function RowMenu({ label, editHref, fieldsHref, onAddSub, onDelete }: RowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${label}`} className="size-8 cursor-pointer text-muted-foreground hover:text-foreground">
            <DotsThreeVertical size={16} weight="bold" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem render={<Link href={editHref} className="flex w-full cursor-pointer items-center gap-2 text-xs font-medium" />}>
          <PencilSimple size={14} /> Edit
        </DropdownMenuItem>
        {onAddSub && (
          <DropdownMenuItem onClick={onAddSub} className="cursor-pointer gap-2 text-xs font-medium">
            <Plus size={14} /> Add subcategory
          </DropdownMenuItem>
        )}
        <DropdownMenuItem render={<Link href={fieldsHref} className="flex w-full cursor-pointer items-center gap-2 text-xs font-medium" />}>
          <Sliders size={14} /> Manage fields
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-2 text-xs font-medium text-destructive focus:text-destructive">
          <Trash size={14} /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CategoryTreeList({ categories: fallbackCategories = [] }: CategoryTreeListProps) {
  const { data } = useAdminCategories()
  const deleteCategory = useDeleteCategory()
  const categories = data ?? fallbackCategories
  const [search, setSearch] = useState("")
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addSubParentId, setAddSubParentId] = useState<string>("none")
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string
    name: string
    type: "category" | "subcategory"
  } | null>(null)

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

  const openAddSub = (parentId: string) => {
    setAddSubParentId(parentId)
    setIsAddDialogOpen(true)
  }

  const handleOpenAddRoot = () => {
    setAddSubParentId("none")
    setIsAddDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      await deleteCategory.mutateAsync(categoryToDelete.id)
      setCategoryToDelete(null)
    } catch {
      // The mutation displays the API error and keeps the dialog open for review.
    }
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
              <p className="text-xxs text-muted-foreground">
                Try searching for a different name or create a new category.
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => {
              const isExpanded = Boolean(effectiveExpanded[category.id])
              const subCount = category.subcategories.length

              return (
                <div key={category.id}>
                  <div
                    onClick={() => toggleExpand(category.id)}
                    className="flex cursor-pointer items-center gap-3 px-3.5 py-3 transition-colors hover:bg-muted/30 sm:px-4"
                  >
                    <button
                      type="button"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                      aria-expanded={isExpanded}
                      className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(category.id)
                      }}
                    >
                      {isExpanded ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
                    </button>

                    <CategoryImage url={category.imageUrl} name={category.name} className="size-10 rounded-lg" iconSize={18} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{category.name}</p>
                      {category.nameKm && <p className="truncate text-xs text-muted-foreground">{category.nameKm}</p>}
                    </div>

                    <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                      {subCount > 0 && <span>{subCount} sub · </span>}
                      {category.listingCount.toLocaleString()} {category.listingCount === 1 ? "ad" : "ads"}
                    </p>
                    {!category.isActive && <Badge variant="secondary" className="shrink-0 text-2xs">Inactive</Badge>}

                    <div onClick={(e) => e.stopPropagation()}>
                      <RowMenu
                        label={category.name}
                        editHref={`/admin/categories/${category.id}`}
                        fieldsHref={`/admin/listing-fields?category=${category.id}`}
                        onAddSub={() => openAddSub(category.id)}
                        onDelete={() => setCategoryToDelete({ id: category.id, name: category.name, type: "category" })}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-0.5 border-t border-border/40 bg-muted/15 py-1.5 pr-3.5 pl-12 sm:pr-4 sm:pl-16">
                      {category.subcategories.length === 0 ? (
                        <div className="flex items-center justify-between px-3 py-2.5 text-xs text-muted-foreground">
                          <span>No subcategories yet.</span>
                          <Button variant="ghost" size="sm" onClick={() => openAddSub(category.id)} className="h-7 gap-1 px-2 text-xs font-semibold text-primary">
                            <Plus size={11} weight="bold" />
                            Add subcategory
                          </Button>
                        </div>
                      ) : (
                        category.subcategories.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-card sm:px-3">
                            <CategoryImage url={sub.imageUrl} name={sub.name} className="size-8 rounded-md" iconSize={14} />
                            <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{sub.name}</p>
                            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                              {sub.listingCount.toLocaleString()} {sub.listingCount === 1 ? "ad" : "ads"}
                            </span>
                            {!sub.isActive && <Badge variant="secondary" className="shrink-0 text-2xs">Inactive</Badge>}
                            <RowMenu
                              label={sub.name}
                              editHref={`/admin/categories/${sub.id}`}
                              fieldsHref={`/admin/listing-fields?category=${sub.id}`}
                              onDelete={() => setCategoryToDelete({ id: sub.id, name: sub.name, type: "subcategory" })}
                            />
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

      <ConfirmationDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title={`Delete ${categoryToDelete?.type ?? "category"}?`}
        description={
          categoryToDelete
            ? `"${categoryToDelete.name}" will be permanently deleted. Categories containing subcategories or listings must be emptied first.`
            : "This category will be permanently deleted."
        }
        confirmLabel="Delete"
        variant="destructive"
        isPending={deleteCategory.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}
