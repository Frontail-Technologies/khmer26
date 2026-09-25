"use client"

import { useState, useRef, type ChangeEvent } from "react"
import Image from "next/image"
import {
  Image as ImageIcon,
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  UploadSimple,
  X,
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
import type { AdminBannerItem, BannerPlacement, BannerDestinationType } from "../types"

interface BannersWorkspaceProps {
  initialBanners: AdminBannerItem[]
}

const PLACEMENT_OPTIONS = [
  { value: "all", label: "All Placements" },
  { value: "homepage_hero", label: "Homepage Hero Slider" },
  { value: "homepage_cta", label: "Homepage Sell CTA" },
  { value: "category_header", label: "Category Header Banner" },
  { value: "listing_sidebar", label: "Listing Detail Sidebar" },
]

const PLACEMENT_FORM_OPTIONS = PLACEMENT_OPTIONS.filter((p) => p.value !== "all")

const DESTINATION_OPTIONS = [
  { value: "no_action", label: "No Action (Static)" },
  { value: "category", label: "Category Page" },
  { value: "listing", label: "Specific Listing" },
  { value: "url", label: "External / Custom URL" },
]

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export function BannersWorkspace({ initialBanners }: BannersWorkspaceProps) {
  const [banners, setBanners] = useState<AdminBannerItem[]>(initialBanners)
  const [searchQuery, setSearchQuery] = useState("")
  const [placementFilter, setPlacementFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<AdminBannerItem | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formPlacement, setFormPlacement] = useState<BannerPlacement>("homepage_hero")
  const [formImageUrl, setFormImageUrl] = useState("")
  const [formDestinationType, setFormDestinationType] = useState<BannerDestinationType>("category")
  const [formDestinationValue, setFormDestinationValue] = useState("")
  const [formDestinationLabel, setFormDestinationLabel] = useState("")
  const [formStartDate, setFormStartDate] = useState("")
  const [formEndDate, setFormEndDate] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const openAddModal = () => {
    setEditingBanner(null)
    setFormTitle("")
    setFormPlacement("homepage_hero")
    setFormImageUrl("/images/categories/cars.jpg")
    setFormDestinationType("category")
    setFormDestinationValue("/category/vehicles")
    setFormDestinationLabel("Vehicles & Automotive")
    setFormStartDate("")
    setFormEndDate("")
    setFormIsActive(true)
    setIsSheetOpen(true)
  }

  const openEditModal = (b: AdminBannerItem) => {
    setEditingBanner(b)
    setFormTitle(b.title)
    setFormPlacement(b.placement)
    setFormImageUrl(b.imageUrl)
    setFormDestinationType(b.destinationType)
    setFormDestinationValue(b.destinationValue)
    setFormDestinationLabel(b.destinationLabel ?? "")
    setFormStartDate(b.startDate ?? "")
    setFormEndDate(b.endDate ?? "")
    setFormIsActive(b.isActive)
    setIsSheetOpen(true)
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive } : b))
    )
  }

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFormImageUrl(previewUrl)
    }
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                title: formTitle.trim(),
                placement: formPlacement,
                imageUrl: formImageUrl || "/images/categories/cars.jpg",
                destinationType: formDestinationType,
                destinationValue: formDestinationValue.trim(),
                destinationLabel: formDestinationLabel.trim() || undefined,
                startDate: formStartDate || undefined,
                endDate: formEndDate || undefined,
                isActive: formIsActive,
              }
            : b
        )
      )
    } else {
      const newBanner: AdminBannerItem = {
        id: `BAN-${banners.length + 101}`,
        title: formTitle.trim(),
        placement: formPlacement,
        imageUrl: formImageUrl || "/images/categories/cars.jpg",
        destinationType: formDestinationType,
        destinationValue: formDestinationValue.trim(),
        destinationLabel: formDestinationLabel.trim() || undefined,
        startDate: formStartDate || undefined,
        endDate: formEndDate || undefined,
        isActive: formIsActive,
        sortOrder: banners.length + 1,
        clicksCount: 0,
        viewsCount: 0,
      }
      setBanners((prev) => [newBanner, ...prev])
    }

    setIsSheetOpen(false)
  }

  const filteredBanners = banners.filter((b) => {
    if (placementFilter !== "all" && b.placement !== placementFilter) return false
    if (statusFilter === "active" && !b.isActive) return false
    if (statusFilter === "inactive" && b.isActive) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      b.title.toLowerCase().includes(q) ||
      b.destinationValue.toLowerCase().includes(q) ||
      (b.destinationLabel && b.destinationLabel.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ImageIcon size={20} weight="duotone" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Banners</h1>
            <p className="text-xs text-muted-foreground">
              Schedule and manage promotional banners across marketplace surfaces.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={openAddModal}
          className="h-8 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={14} weight="bold" />
          <span>Add Banner</span>
        </Button>
      </div>

      <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden flex flex-col min-w-0">
        <div className="p-3.5 border-b border-border/60 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <MagnifyingGlass
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search banners by title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={placementFilter}
              onValueChange={(val) => {
                if (val) setPlacementFilter(val)
              }}
              items={PLACEMENT_OPTIONS}
            >
              <SelectTrigger className="w-44 h-8.5 text-xs">
                <SelectValue>
                  {getSelectOptionLabel(PLACEMENT_OPTIONS, placementFilter, "Placement")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PLACEMENT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                if (val) setStatusFilter(val)
              }}
              items={STATUS_FILTER_OPTIONS}
            >
              <SelectTrigger className="w-32 h-8.5 text-xs">
                <SelectValue>
                  {getSelectOptionLabel(STATUS_FILTER_OPTIONS, statusFilter, "Status")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto min-w-0 flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                <TableHead className="text-[11px] font-bold">Banner</TableHead>
                <TableHead className="text-[11px] font-bold">Placement</TableHead>
                <TableHead className="text-[11px] font-bold">Destination</TableHead>
                <TableHead className="text-[11px] font-bold">Status</TableHead>
                <TableHead className="text-[11px] font-bold">Schedule</TableHead>
                <TableHead className="w-20 text-[11px] font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.length > 0 ? (
                filteredBanners.map((b) => (
                  <TableRow key={b.id} className="border-b border-border/50 hover:bg-muted/20">
                    <TableCell className="min-w-64">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-lg overflow-hidden bg-muted/60 relative shrink-0 border border-border/50">
                          <Image
                            src={b.imageUrl}
                            alt={b.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-foreground block truncate">
                            {b.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground block">
                            {b.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {b.placement.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0 max-w-44">
                        <span className="text-xs font-medium text-foreground block truncate">
                          {b.destinationLabel ?? b.destinationValue}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {b.destinationType.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={b.isActive}
                        onCheckedChange={(checked) => handleToggleActive(b.id, checked)}
                        aria-label={`Toggle active state for ${b.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      {b.startDate && b.endDate ? (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {b.startDate} → {b.endDate}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Always Active</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => openEditModal(b)}
                          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Edit banner"
                        >
                          <PencilSimple size={13} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeleteBanner(b.id)}
                          className="size-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                          aria-label="Delete banner"
                        >
                          <Trash size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    No promotional banners found.
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
              {editingBanner ? "Edit Banner" : "Add Banner"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Configure banner placement, image creative, and destination.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveForm} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <Field>
                <FieldLabel required>Banner Title</FieldLabel>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Khmer New Year 2026 Mega Expo"
                  className="h-9 text-xs"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Placement Surface</FieldLabel>
                <Select
                  value={formPlacement}
                  onValueChange={(val) => {
                    if (val) setFormPlacement(val as BannerPlacement)
                  }}
                  items={PLACEMENT_FORM_OPTIONS}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue>
                      {getSelectOptionLabel(PLACEMENT_FORM_OPTIONS, formPlacement, "Placement")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PLACEMENT_FORM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Banner Creative Image</FieldLabel>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="space-y-2">
                  <div className="h-28 rounded-lg border border-dashed border-border flex flex-col items-center justify-center p-3 text-center bg-background/50 relative overflow-hidden group">
                    {formImageUrl ? (
                      <>
                        <Image
                          src={formImageUrl}
                          alt="Banner preview"
                          fill
                          className="object-cover opacity-80 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/60">
                          <Button
                            type="button"
                            size="xs"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs cursor-pointer"
                          >
                            Replace
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="outline"
                            onClick={() => setFormImageUrl("")}
                            className="size-7 p-0 cursor-pointer text-destructive"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <UploadSimple size={20} />
                        <span className="text-xs font-medium">Click or drop banner file</span>
                        <span className="text-[10px] text-muted-foreground">
                          PNG, JPG or WebP (max 4MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Field>

              <Field>
                <FieldLabel>Destination Type</FieldLabel>
                <Select
                  value={formDestinationType}
                  onValueChange={(val) => {
                    if (val) setFormDestinationType(val as BannerDestinationType)
                  }}
                  items={DESTINATION_OPTIONS}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue>
                      {getSelectOptionLabel(DESTINATION_OPTIONS, formDestinationType, "Type")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {formDestinationType !== "no_action" && (
                <div className="space-y-3">
                  <Field>
                    <FieldLabel>Destination Path / URL</FieldLabel>
                    <Input
                      value={formDestinationValue}
                      onChange={(e) => setFormDestinationValue(e.target.value)}
                      placeholder={
                        formDestinationType === "category"
                          ? "/category/vehicles"
                          : formDestinationType === "listing"
                          ? "/listing/LST-8901"
                          : "https://example.com"
                      }
                      className="h-9 text-xs"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Target Label</FieldLabel>
                    <Input
                      value={formDestinationLabel}
                      onChange={(e) => setFormDestinationLabel(e.target.value)}
                      placeholder="Display label or category name"
                      className="h-9 text-xs"
                    />
                  </Field>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Start Date</FieldLabel>
                  <Input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="h-9 text-xs"
                  />
                </Field>

                <Field>
                  <FieldLabel>End Date</FieldLabel>
                  <Input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="h-9 text-xs"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Active Banner
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Display banner on live placement
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
                {editingBanner ? "Save Changes" : "Create Banner"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
