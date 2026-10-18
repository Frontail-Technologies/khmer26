"use client"

import { useMemo, useState } from "react"
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
  DotsSixVertical,
  Images,
  Sparkle,
  PencilSimple,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { DragReorderList } from "@/components/shared/drag-reorder-list"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BilingualField } from "@/components/admin/bilingual-field"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import { AdminImageThumbnail } from "@/components/shared/admin-image-preview"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAdminCategories } from "@/features/admin/categories/hooks/categories.queries"
import {
  useAdminBanners,
  useAdminFeaturedSections,
  useAdminHomepageConfig,
  useAdminHomepagePopularCategories,
} from "../hooks/content.queries"
import { useUpdateHomepageConfig, useUpdateHomepagePopularCategories } from "../hooks/content.mutations"
import type {
  AdminBannerItem,
  HomepageLayoutItem,
  HomepageSectionConfig,
  PopularCategoryItem,
} from "../types"
import type { AdminCategoryItem } from "@/features/admin/categories/types"

interface HomepageWorkspaceProps {
  initialSections?: HomepageSectionConfig[]
  initialPopularCategories: PopularCategoryItem[]
}

const SECTION_TYPE_OPTIONS: { value: HomepageSectionConfig["type"]; label: string }[] = [
  { value: "hero_slider", label: "Hero Slider" },
  { value: "categories_grid", label: "Categories Grid" },
  { value: "featured_listings", label: "Featured Listings" },
  { value: "location_browser", label: "Location Browser" },
  { value: "trust_banner", label: "Trust Banner" },
  { value: "recent_listings", label: "Recent Listings" },
]

export function HomepageWorkspace({
  initialSections = [],
  initialPopularCategories,
}: HomepageWorkspaceProps) {
  const { data: remoteSections } = useAdminHomepageConfig()
  const { data: featuredSections = [] } = useAdminFeaturedSections()
  const { data: banners = [] } = useAdminBanners()
  const { data: categoryTree = [] } = useAdminCategories()
  const { data: remotePopularCategories } = useAdminHomepagePopularCategories()
  const builtinSections = remoteSections ?? initialSections
  const combinedSections = useMemo<HomepageLayoutItem[]>(() => [
    ...builtinSections.map((section) => ({ ...section, kind: "builtin" as const })),
    ...featuredSections
      .filter((section) => section.slug !== "homepage-popular-categories")
      .map((section) => ({
        kind: "featured" as const,
        id: section.id,
        title: section.title,
        subtitle: `${section.sourceType.replaceAll("_", " ")} listings`,
        type: "featured_section" as const,
        isEnabled: section.isActive,
        sortOrder: section.sortOrder,
        sourceType: section.sourceType,
      })),
  ].sort((a, b) => a.sortOrder - b.sortOrder), [builtinSections, featuredSections])
  const [localSections, setLocalSections] = useState<HomepageLayoutItem[] | null>(null)
  const sections = localSections ?? combinedSections
  const updateHomepageConfig = useUpdateHomepageConfig()
  const updatePopularCategories = useUpdateHomepagePopularCategories()

  const [localPopularCategories, setLocalPopularCategories] = useState<PopularCategoryItem[] | null>(null)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [searchCategoryQuery, setSearchCategoryQuery] = useState("")
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null)

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [newSectionType, setNewSectionType] = useState<HomepageSectionConfig["type"]>("hero_slider")
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [newSectionSubtitle, setNewSectionSubtitle] = useState("")
  const [newSectionTitleKm, setNewSectionTitleKm] = useState("")
  const [newSectionSubtitleKm, setNewSectionSubtitleKm] = useState("")
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)

  const homepageBanners = banners.filter((banner) =>
    ["homepage", "homepage_hero", "homepage_cta"].includes(banner.placement)
  )

  const buildLayoutPayload = (
    newSections: HomepageLayoutItem[],
    orderedBanners: AdminBannerItem[] = homepageBanners
  ) => ({
    sections: newSections
      .filter((section): section is HomepageLayoutItem & { kind: "builtin" } => section.kind === "builtin")
      .map((section) => ({
        sectionKey: section.id,
        title: section.title,
        titleKm: section.titleKm,
        subtitle: section.subtitle,
        subtitleKm: section.subtitleKm,
        isEnabled: section.isEnabled,
        sortOrder: section.sortOrder,
        itemCount: section.itemCount,
      })),
    featuredSections: newSections
      .filter((section) => section.kind === "featured")
      .map((section) => ({
        id: section.id,
        isActive: section.isEnabled,
        sortOrder: section.sortOrder,
      })),
    banners: orderedBanners.map((banner) => ({
      id: banner.id,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
    })),
  })

  const persistSections = (newSections: HomepageLayoutItem[]) => {
    setLocalSections(newSections)
    updateHomepageConfig.mutate(buildLayoutPayload(newSections))
  }

  const persistBannerOrder = (placementBanners: AdminBannerItem[]) => {
    const placement = placementBanners[0]?.placement
    const isHeroPlacement = placement === "homepage_hero" || (placement as string) === "homepage"
    const ordered = banners.map((banner) => {
      const isSamePlacement = isHeroPlacement
        ? banner.placement === "homepage_hero" || (banner.placement as string) === "homepage"
        : banner.placement === placement
      if (!isSamePlacement) return banner
      const index = placementBanners.findIndex((item) => item.id === banner.id)
      return index >= 0 ? { ...banner, sortOrder: index + 1 } : banner
    })
    updateHomepageConfig.mutate(buildLayoutPayload(sections, ordered))
  }

  const handleToggleSection = (id: string, isEnabled: boolean) => {
    persistSections(sections.map((sec) => (sec.id === id ? { ...sec, isEnabled } : sec)))
  }

  const availableSectionTypes = SECTION_TYPE_OPTIONS.filter(
    (opt) => !sections.some((sec) => sec.id === opt.value)
  )

  const openAddSectionModal = () => {
    const firstAvailable = availableSectionTypes[0]
    setNewSectionType(firstAvailable?.value ?? "hero_slider")
    setNewSectionTitle(firstAvailable?.label ?? "")
    setNewSectionSubtitle("")
    setNewSectionTitleKm("")
    setNewSectionSubtitleKm("")
    setEditingSectionId(null)
    setIsAddSectionOpen(true)
  }

  const openEditSectionTitles = (section: HomepageLayoutItem) => {
    setEditingSectionId(section.id)
    setNewSectionTitle(section.title)
    setNewSectionTitleKm(section.titleKm ?? "")
    setNewSectionSubtitle(section.subtitle ?? "")
    setNewSectionSubtitleKm(section.subtitleKm ?? "")
    setIsAddSectionOpen(true)
  }

  const handleSaveSectionTitles = () => {
    if (!editingSectionId || !newSectionTitle.trim()) return
    persistSections(
      sections.map((sec) =>
        sec.id === editingSectionId
          ? {
              ...sec,
              title: newSectionTitle.trim(),
              titleKm: newSectionTitleKm.trim() || null,
              subtitle: newSectionSubtitle.trim() || undefined,
              subtitleKm: newSectionSubtitleKm.trim() || null,
            }
          : sec
      )
    )
    setIsAddSectionOpen(false)
    setEditingSectionId(null)
  }

  const handleConfirmAddSection = () => {
    if (!newSectionTitle.trim()) return
    if (sections.some((sec) => sec.id === newSectionType)) return

    const newSection: HomepageLayoutItem = {
      kind: "builtin",
      id: newSectionType,
      title: newSectionTitle.trim(),
      titleKm: newSectionTitleKm.trim() || null,
      subtitle: newSectionSubtitle.trim() || undefined,
      subtitleKm: newSectionSubtitleKm.trim() || null,
      type: newSectionType,
      isEnabled: true,
      sortOrder: sections.length + 1,
    }

    persistSections([...sections, newSection])
    setIsAddSectionOpen(false)
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

    persistSections(newSections.map((sec, idx) => ({ ...sec, sortOrder: idx + 1 })))
  }

  const persistPopularCategories = (newCategories: PopularCategoryItem[]) => {
    const ordered = newCategories.map((cat, idx) => ({ ...cat, sortOrder: idx + 1 }))
    setLocalPopularCategories(ordered)
    updatePopularCategories.mutate(
      ordered.map((cat) => ({ categoryId: cat.id, sortOrder: cat.sortOrder }))
    )
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

    persistPopularCategories(newCats)
  }

  const handleRemoveCategory = (id: string) => {
    persistPopularCategories(popularCategories.filter((c) => c.id !== id))
  }

  const allSelectableCategories = useMemo(() => categoryTree.flatMap((root: AdminCategoryItem) => {
    const rootItem = {
      key: root.id,
      id: root.id,
      name: root.name,
      slug: root.slug,
      imageUrl: root.imageUrl || "",
      parentCategoryName: undefined as string | undefined,
      listingCount: root.listingCount,
    }

    const subItems = root.subcategories.map((sub) => ({
      key: sub.id,
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      imageUrl: sub.imageUrl || root.imageUrl || "",
      parentCategoryName: root.name,
      listingCount: sub.listingCount,
    }))

    return [rootItem, ...subItems]
  }), [categoryTree])

  const selectableById = useMemo(
    () => new Map(allSelectableCategories.map((cat) => [cat.id, cat])),
    [allSelectableCategories]
  )

  const popularCategories = (localPopularCategories ?? remotePopularCategories ?? initialPopularCategories)
    .map((cat) => {
      const detail = selectableById.get(cat.id)
      return detail
        ? {
            ...cat,
            name: detail.name,
            slug: detail.slug,
            imageUrl: detail.imageUrl,
            parentCategoryName: detail.parentCategoryName,
            listingCount: detail.listingCount,
          }
        : cat
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)

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
      id: chosen.id,
      name: chosen.name,
      slug: chosen.slug,
      imageUrl: chosen.imageUrl,
      parentCategoryName: chosen.parentCategoryName,
      listingCount: chosen.listingCount,
      sortOrder: popularCategories.length + 1,
    }

    persistPopularCategories([...popularCategories, newPopular])
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
          <h1 className="text-base font-bold text-foreground">Homepage</h1>
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
          <div className="flex items-center justify-between mb-3 gap-2">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Homepage Sections
            </h2>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {sections.filter((s) => s.isEnabled).length} of {sections.length} active
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={openAddSectionModal}
                disabled={availableSectionTypes.length === 0}
                className="h-7 px-2.5 text-xxs font-semibold gap-1 cursor-pointer"
              >
                <Plus size={12} weight="bold" />
                <span>Add Section</span>
              </Button>
            </div>
          </div>

          <DragReorderList
            items={sections}
            getId={(section) => section.id}
            onReorder={(newSections) => persistSections(newSections.map((sec, idx) => ({ ...sec, sortOrder: idx + 1 })))}
            className="divide-y divide-border/50 border border-border/60 rounded-xl overflow-hidden bg-background/50"
            itemClassName="bg-background/50"
            renderItem={(section, idx, { isDragging, isDropTarget }) => {
              const isFirst = idx === 0
              const isLast = idx === sections.length - 1
              const bannerPlacement = section.kind === "builtin" && section.type === "hero_slider"
                ? "homepage_hero"
                : section.kind === "builtin" && section.type === "trust_banner"
                  ? "homepage_cta"
                  : null
              const attachedBanners = bannerPlacement
                ? homepageBanners
                    .filter((banner) => bannerPlacement === "homepage_hero"
                      ? banner.placement === "homepage_hero" || (banner.placement as string) === "homepage"
                      : banner.placement === bannerPlacement)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                : []

              const moveBanner = (bannerIndex: number, direction: "up" | "down") => {
                const targetIndex = direction === "up" ? bannerIndex - 1 : bannerIndex + 1
                if (targetIndex < 0 || targetIndex >= attachedBanners.length) return
                const reordered = [...attachedBanners]
                const current = reordered[bannerIndex]
                const target = reordered[targetIndex]
                if (!current || !target) return
                reordered[bannerIndex] = target
                reordered[targetIndex] = current
                persistBannerOrder(reordered)
              }

              return (
                <div
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    isDragging && "opacity-40",
                    isDropTarget && "ring-2 ring-primary/30 bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <DotsSixVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />
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
                          {section.kind === "featured" ? (
                            <Sparkle size={14} weight="duotone" className="text-primary" />
                          ) : bannerPlacement ? (
                            <Images size={14} weight="duotone" className="text-primary" />
                          ) : null}
                          <span className="text-xs font-semibold text-foreground truncate">
                            {section.title}
                          </span>
                          <Badge variant="outline" className="text-2xs px-1.5 py-0 h-4">
                            {section.kind === "featured" ? "Featured" : "Built-in"}
                          </Badge>
                        </div>
                        {(section.subtitle || bannerPlacement) && (
                          <p className="text-xxs text-muted-foreground truncate mt-0.5">
                            {bannerPlacement
                              ? `${attachedBanners.length} banner${attachedBanners.length === 1 ? "" : "s"}`
                              : section.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {(section.kind === "featured" || bannerPlacement) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xxs"
                          render={
                            <Link href={section.kind === "featured"
                              ? "/admin/content/featured-sections"
                              : "/admin/content/banners"}
                            >
                              Manage
                            </Link>
                          }
                        />
                      )}
                      {section.kind === "builtin" && (
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          aria-label={`Edit titles for ${section.title}`}
                          onClick={() => openEditSectionTitles(section)}
                        >
                          <PencilSimple size={13} />
                        </Button>
                      )}
                      <Switch
                        checked={section.isEnabled}
                        onCheckedChange={(checked) => handleToggleSection(section.id, checked)}
                        aria-label={`Toggle ${section.title}`}
                      />
                    </div>
                  </div>

                  {attachedBanners.length > 0 && (
                    <div className="border-t border-border/50 bg-muted/10 px-4 py-2 pl-24 space-y-1">
                      {attachedBanners.map((banner, bannerIndex) => (
                        <div key={banner.id} className="flex items-center justify-between gap-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <AdminImageThumbnail
                              src={banner.imageUrl}
                              alt=""
                              containerClassName="size-7 rounded border border-border/50 shrink-0"
                              sizes="28px"
                            />
                            <span className="text-xxs font-medium text-foreground truncate">
                              {banner.title}
                            </span>
                            {!banner.isActive && <Badge variant="secondary" className="text-3xs h-4">Hidden</Badge>}
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              disabled={bannerIndex === 0}
                              onClick={() => moveBanner(bannerIndex, "up")}
                              aria-label={`Move ${banner.title} up`}
                            >
                              <ArrowUp size={11} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              disabled={bannerIndex === attachedBanners.length - 1}
                              onClick={() => moveBanner(bannerIndex, "down")}
                              aria-label={`Move ${banner.title} down`}
                            >
                              <ArrowDown size={11} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            }}
          />
        </div>

        <Separator className="bg-border/60" />

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Popular Categories
            </h2>

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

          <DragReorderList
            items={popularCategories}
            getId={(cat) => cat.id}
            onReorder={persistPopularCategories}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            renderItem={(cat, idx, { isDragging, isDropTarget }) => {
              const isFirst = idx === 0
              const isLast = idx === popularCategories.length - 1

              return (
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-background/60 hover:bg-muted/20 transition-colors",
                    isDragging && "opacity-40",
                    isDropTarget && "ring-2 ring-primary/30 bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {cat.imageUrl ? (
                      <AdminImageThumbnail
                        src={cat.imageUrl}
                        alt={cat.name}
                        containerClassName="size-10 rounded-lg bg-muted/50 border border-border/40 shrink-0"
                        sizes="40px"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-muted/60 border border-border/40 shrink-0 flex items-center justify-center text-2xs font-bold text-muted-foreground">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-foreground block truncate">
                        {cat.name}
                      </span>
                      <span className="text-2xs text-muted-foreground block truncate">
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
            }}
          />
        </div>
      </Card>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold text-foreground">
              Add Popular Category
            </DialogTitle>
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
                      {cat.imageUrl ? (
                        <div className="size-8 rounded overflow-hidden bg-muted relative shrink-0">
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="size-8 rounded bg-muted relative shrink-0 flex items-center justify-center text-2xs font-bold text-muted-foreground">
                          {cat.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-medium block truncate">
                          {cat.name}
                        </span>
                        <span className="text-2xs text-muted-foreground block truncate">
                          {cat.parentCategoryName ?? "Root Category"} · {cat.listingCount} listings
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isAlreadySelected ? (
                        <span className="text-2xs text-muted-foreground">Added</span>
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

      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold text-foreground">
              Add Homepage Section
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 sm:p-5 space-y-4">
            {!editingSectionId && (
              <Field>
                <FieldLabel required>Section Type</FieldLabel>
                <Select
                  value={newSectionType}
                  items={availableSectionTypes}
                  onValueChange={(val) => {
                    if (!val) return
                    const typed = val as HomepageSectionConfig["type"]
                    setNewSectionType(typed)
                    const opt = SECTION_TYPE_OPTIONS.find((o) => o.value === typed)
                    if (opt && (!newSectionTitle.trim() || SECTION_TYPE_OPTIONS.some((o) => o.label === newSectionTitle))) {
                      setNewSectionTitle(opt.label)
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(availableSectionTypes, val, "Select section type")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableSectionTypes.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            <BilingualField
              id="section-title"
              label="Title"
              required
              stacked
              valueEn={newSectionTitle}
              valueKm={newSectionTitleKm}
              onChangeEn={setNewSectionTitle}
              onChangeKm={setNewSectionTitleKm}
              placeholderEn="e.g. Featured Listings"
              maxLength={200}
            />

            <BilingualField
              id="section-subtitle"
              label="Subtitle"
              stacked
              valueEn={newSectionSubtitle}
              valueKm={newSectionSubtitleKm}
              onChangeEn={setNewSectionSubtitle}
              onChangeKm={setNewSectionSubtitleKm}
              placeholderEn="Optional short description"
              maxLength={400}
            />
          </div>

          <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddSectionOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!newSectionTitle.trim()}
              onClick={editingSectionId ? handleSaveSectionTitles : handleConfirmAddSection}
              className="text-xs font-semibold cursor-pointer"
            >
              {editingSectionId ? "Save Titles" : "Add Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
