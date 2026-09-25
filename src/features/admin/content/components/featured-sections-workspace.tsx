"use client"

import { useState } from "react"
import {
  Sparkle,
  Plus,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ALL_DETAILED_CATEGORIES } from "@/features/categories/data/all-categories"
import type { FeaturedSectionItem, FeaturedSourceType, FeaturedSortMode } from "../types"

interface FeaturedSectionsWorkspaceProps {
  initialSections: FeaturedSectionItem[]
}

const SOURCE_OPTIONS = [
  { value: "category", label: "By Category" },
  { value: "featured", label: "Featured & Promoted" },
  { value: "latest", label: "Latest Approved" },
  { value: "most_viewed", label: "Most Viewed" },
]

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "featured", label: "Featured Priority" },
]

export function FeaturedSectionsWorkspace({
  initialSections,
}: FeaturedSectionsWorkspaceProps) {
  const [sections, setSections] = useState<FeaturedSectionItem[]>(initialSections)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<FeaturedSectionItem | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formSourceType, setFormSourceType] = useState<FeaturedSourceType>("category")
  const [formCategoryIds, setFormCategoryIds] = useState<string[]>([])
  const [formSortMode, setFormSortMode] = useState<FeaturedSortMode>("featured")
  const [formIsActive, setFormIsActive] = useState(true)

  const openAddModal = () => {
    setEditingSection(null)
    setFormTitle("")
    setFormSlug("")
    setFormSourceType("category")
    setFormCategoryIds([])
    setFormSortMode("featured")
    setFormIsActive(true)
    setIsSheetOpen(true)
  }

  const openEditModal = (sec: FeaturedSectionItem) => {
    setEditingSection(sec)
    setFormTitle(sec.title)
    setFormSlug(sec.slug)
    setFormSourceType(sec.sourceType)
    setFormCategoryIds(sec.categoryIds)
    setFormSortMode(sec.sortMode)
    setFormIsActive(sec.isActive)
    setIsSheetOpen(true)
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive } : s))
    )
  }

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const newSections = [...sections]
    const temp = newSections[index]
    const target = newSections[targetIndex]
    if (!temp || !target) return

    newSections[index] = target
    newSections[targetIndex] = temp

    setSections(newSections.map((s, idx) => ({ ...s, sortOrder: idx + 1 })))
  }

  const handleDeleteSection = (id: string) => {
    setSections((prev) =>
      prev.filter((s) => s.id !== id).map((s, idx) => ({ ...s, sortOrder: idx + 1 }))
    )
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const computedSlug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const selectedCategoryNames = ALL_DETAILED_CATEGORIES.filter((c) =>
      formCategoryIds.includes(c.id)
    ).map((c) => c.name)

    if (editingSection) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingSection.id
            ? {
                ...s,
                title: formTitle.trim(),
                slug: computedSlug,
                sourceType: formSourceType,
                categoryIds: formCategoryIds,
                categoryNames: selectedCategoryNames,
                sortMode: formSortMode,
                isActive: formIsActive,
              }
            : s
        )
      )
    } else {
      const newSection: FeaturedSectionItem = {
        id: `feat-sec-${computedSlug}`,
        title: formTitle.trim(),
        slug: computedSlug,
        sourceType: formSourceType,
        categoryIds: formCategoryIds,
        categoryNames: selectedCategoryNames,
        sortMode: formSortMode,
        displayStyle: "grid",
        isActive: formIsActive,
        sortOrder: sections.length + 1,
        itemsCount: 8,
      }
      setSections((prev) => [...prev, newSection])
    }

    setIsSheetOpen(false)
  }

  const toggleCategorySelection = (categoryId: string) => {
    setFormCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredSections = sections.filter((s) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      s.title.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.categoryNames.some((c) => c.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkle size={20} weight="duotone" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Featured Sections</h1>
            <p className="text-xs text-muted-foreground">
              Manage dynamic listing sections on homepage and discovery surfaces.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={openAddModal}
          className="h-8 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={14} weight="bold" />
          <span>Add Section</span>
        </Button>
      </div>

      <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden flex flex-col min-w-0">
        <div className="p-3.5 border-b border-border/60">
          <div className="relative max-w-sm">
            <MagnifyingGlass
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search featured sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-w-0 flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                <TableHead className="w-12 text-[11px] font-bold">#</TableHead>
                <TableHead className="text-[11px] font-bold">Section</TableHead>
                <TableHead className="text-[11px] font-bold">Source</TableHead>
                <TableHead className="text-[11px] font-bold">Categories</TableHead>
                <TableHead className="text-[11px] font-bold">Sort Mode</TableHead>
                <TableHead className="text-[11px] font-bold">Status</TableHead>
                <TableHead className="w-20 text-[11px] font-bold text-center">Order</TableHead>
                <TableHead className="w-20 text-[11px] font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.length > 0 ? (
                filteredSections.map((sec, idx) => {
                  const isFirst = idx === 0
                  const isLast = idx === filteredSections.length - 1

                  return (
                    <TableRow key={sec.id} className="border-b border-border/50 hover:bg-muted/20">
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="min-w-44">
                        <span className="text-xs font-semibold text-foreground block">
                          {sec.title}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {sec.slug}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {sec.sourceType.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {sec.categoryNames.length > 0 ? (
                            sec.categoryNames.map((catName) => (
                              <Badge
                                key={catName}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-4.5 bg-muted text-foreground"
                              >
                                {catName}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">All Categories</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground capitalize">
                          {sec.sortMode.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={sec.isActive}
                          onCheckedChange={(checked) => handleToggleActive(sec.id, checked)}
                          aria-label={`Toggle active state for ${sec.title}`}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={isFirst}
                            onClick={() => handleMoveSection(idx, "up")}
                            className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Move section up"
                          >
                            <ArrowUp size={11} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={isLast}
                            onClick={() => handleMoveSection(idx, "down")}
                            className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Move section down"
                          >
                            <ArrowDown size={11} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => openEditModal(sec)}
                            className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Edit section"
                          >
                            <PencilSimple size={13} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDeleteSection(sec.id)}
                            className="size-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                            aria-label="Delete section"
                          >
                            <Trash size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">
                    No featured sections found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col h-full overflow-hidden bg-card"
        >
          <SheetHeader className="p-4 sm:p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-bold text-foreground">
              {editingSection ? "Edit Featured Section" : "Add Featured Section"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Configure collection criteria and discovery presentation.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveForm} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <Field>
                <FieldLabel required>Section Title</FieldLabel>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Featured Luxury Vehicles"
                  className="h-9 text-xs"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="h-9 text-xs"
                />
              </Field>

              <Field>
                <FieldLabel>Source Type</FieldLabel>
                <Select
                  value={formSourceType}
                  onValueChange={(val) => {
                    if (val) setFormSourceType(val as FeaturedSourceType)
                  }}
                  items={SOURCE_OPTIONS}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue>
                      {getSelectOptionLabel(SOURCE_OPTIONS, formSourceType, "Select source")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {formSourceType === "category" && (
                <Field>
                  <FieldLabel>Target Categories</FieldLabel>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-lg border border-border/50 bg-background/50">
                    {ALL_DETAILED_CATEGORIES.map((cat) => {
                      const isSelected = formCategoryIds.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`w-full flex items-center justify-between p-2 rounded text-xs transition-colors cursor-pointer text-left ${
                            isSelected
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted/40 text-foreground"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {cat.listingCount} ads
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}

              <Field>
                <FieldLabel>Sort Order Rule</FieldLabel>
                <Select
                  value={formSortMode}
                  onValueChange={(val) => {
                    if (val) setFormSortMode(val as FeaturedSortMode)
                  }}
                  items={SORT_OPTIONS}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue>
                      {getSelectOptionLabel(SORT_OPTIONS, formSortMode, "Select sort rule")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Active Status
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Display section on live marketplace
                  </span>
                </div>
                <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
              </div>
            </div>

            <SheetFooter className="p-4 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSheetOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!formTitle.trim()}
                className="text-xs font-semibold cursor-pointer"
              >
                {editingSection ? "Save Changes" : "Create Section"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
