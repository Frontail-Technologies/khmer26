"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowSquareOut,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash,
  MagnifyingGlass,
  Check,
  House,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ALL_DETAILED_CATEGORIES } from "@/features/categories/data/all-categories"
import type { HomepageSectionConfig, PopularCategoryItem } from "../types"

interface HomepageWorkspaceProps {
  initialSections: HomepageSectionConfig[]
  initialPopularCategories: PopularCategoryItem[]
}

export function HomepageWorkspace({
  initialSections,
  initialPopularCategories,
}: HomepageWorkspaceProps) {
  const [sections, setSections] = useState<HomepageSectionConfig[]>(initialSections)
  const [popularCategories, setPopularCategories] = useState<PopularCategoryItem[]>(
    initialPopularCategories
  )
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [searchCategoryQuery, setSearchCategoryQuery] = useState("")
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null)

  const handleToggleSection = (id: string, isEnabled: boolean) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, isEnabled } : sec))
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

    setSections(newSections.map((sec, idx) => ({ ...sec, sortOrder: idx + 1 })))
  }

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= popularCategories.length) return

    const newCats = [...popularCategories]
    const temp = newCats[index]
    const target = newCats[targetIndex]
    if (!temp || !target) return

    newCats[index] = target
    newCats[targetIndex] = temp

    setPopularCategories(newCats.map((cat, idx) => ({ ...cat, sortOrder: idx + 1 })))
  }

  const handleRemoveCategory = (id: string) => {
    setPopularCategories((prev) =>
      prev.filter((c) => c.id !== id).map((cat, idx) => ({ ...cat, sortOrder: idx + 1 }))
    )
  }

  const allSelectableCategories = ALL_DETAILED_CATEGORIES.flatMap((root) => {
    const rootItem = {
      key: `root-${root.id}`,
      id: root.id,
      name: root.name,
      slug: root.slug,
      imageUrl: root.imageUrl,
      parentCategoryName: undefined as string | undefined,
      listingCount: root.listingCount,
    }

    const subItems = root.subcategories.map((sub) => ({
      key: `sub-${sub.id}`,
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      imageUrl: root.imageUrl,
      parentCategoryName: root.name,
      listingCount: sub.listingCount,
    }))

    return [rootItem, ...subItems]
  })

  const filteredSelectable = allSelectableCategories.filter((cat) => {
    if (!searchCategoryQuery.trim()) return true
    const q = searchCategoryQuery.toLowerCase()
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.parentCategoryName && cat.parentCategoryName.toLowerCase().includes(q))
    )
  })

  const handleConfirmAddCategory = () => {
    if (!selectedCategoryKey) return
    const chosen = allSelectableCategories.find((c) => c.key === selectedCategoryKey)
    if (!chosen) return

    const alreadyExists = popularCategories.some((c) => c.slug === chosen.slug)
    if (alreadyExists) {
      setIsAddCategoryOpen(false)
      return
    }

    const newPopular: PopularCategoryItem = {
      id: `pop-${chosen.slug}`,
      name: chosen.name,
      slug: chosen.slug,
      imageUrl: chosen.imageUrl,
      parentCategoryName: chosen.parentCategoryName,
      listingCount: chosen.listingCount,
      sortOrder: popularCategories.length + 1,
    }

    setPopularCategories((prev) => [...prev, newPopular])
    setIsAddCategoryOpen(false)
    setSelectedCategoryKey(null)
    setSearchCategoryQuery("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <House size={20} weight="duotone" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Homepage</h1>
            <p className="text-xs text-muted-foreground">
              Manage section visibility, sort order, and popular categories.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          render={
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <span>Preview Marketplace</span>
              <ArrowSquareOut size={13} />
            </Link>
          }
        />
      </div>

      <Card className="bg-card border-0 shadow-2xs rounded-xl p-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Homepage Sections
            </h2>
            <span className="text-xs text-muted-foreground">
              {sections.filter((s) => s.isEnabled).length} of {sections.length} active
            </span>
          </div>

          <div className="divide-y divide-border/50 border border-border/60 rounded-xl overflow-hidden bg-background/50">
            {sections.map((section, idx) => {
              const isFirst = idx === 0
              const isLast = idx === sections.length - 1

              return (
                <div
                  key={section.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isFirst}
                        onClick={() => handleMoveSection(idx, "up")}
                        className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Move section up"
                      >
                        <ArrowUp size={12} />
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
                        <ArrowDown size={12} />
                      </Button>
                    </div>

                    <span className="text-xs font-bold text-muted-foreground font-mono w-4">
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {section.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                          {section.type}
                        </Badge>
                      </div>
                      {section.subtitle && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Switch
                      checked={section.isEnabled}
                      onCheckedChange={(checked) => handleToggleSection(section.id, checked)}
                      aria-label={`Toggle ${section.title}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Popular Categories
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Selected categories featured prominently with 3D artwork on the homepage.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setSelectedCategoryKey(null)
                setSearchCategoryQuery("")
                setIsAddCategoryOpen(true)
              }}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus size={14} weight="bold" />
              <span>Add Popular Category</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularCategories.map((cat, idx) => {
              const isFirst = idx === 0
              const isLast = idx === popularCategories.length - 1

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-background/60 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-10 rounded-lg overflow-hidden bg-muted/50 border border-border/40 shrink-0 relative">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-foreground block truncate">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {cat.parentCategoryName ?? "Root Category"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isFirst}
                      onClick={() => handleMoveCategory(idx, "up")}
                      className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Move category up"
                    >
                      <ArrowUp size={11} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isLast}
                      onClick={() => handleMoveCategory(idx, "down")}
                      className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Move category down"
                    >
                      <ArrowDown size={11} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveCategory(cat.id)}
                      className="size-6 text-destructive hover:bg-destructive/10 cursor-pointer"
                      aria-label="Remove category"
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold text-foreground">
              Add Popular Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a root category or subcategory to highlight on the homepage.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 sm:p-5 space-y-3">
            <div className="relative">
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchCategoryQuery}
                onChange={(e) => setSearchCategoryQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-border/50 rounded-lg p-1.5 bg-background/50">
              {filteredSelectable.map((cat) => {
                const isAlreadySelected = popularCategories.some((c) => c.slug === cat.slug)
                const isCurrentChoice = selectedCategoryKey === cat.key

                return (
                  <button
                    key={cat.key}
                    type="button"
                    disabled={isAlreadySelected}
                    onClick={() => setSelectedCategoryKey(cat.key)}
                    className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isCurrentChoice
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : isAlreadySelected
                        ? "opacity-50 cursor-not-allowed bg-muted/20"
                        : "hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded overflow-hidden bg-muted relative shrink-0">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {cat.parentCategoryName ?? "Root Category"} · {cat.listingCount} listings
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isAlreadySelected ? (
                        <span className="text-[10px] text-muted-foreground">Added</span>
                      ) : isCurrentChoice ? (
                        <Check size={14} weight="bold" className="text-primary" />
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddCategoryOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedCategoryKey}
              onClick={handleConfirmAddCategory}
              className="text-xs font-semibold cursor-pointer"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
