"use client"

import { useState } from "react"
import {
  Plus,
  Image as ImageIcon,
  DotsThreeVertical,
  Pencil,
  Trash,
  Eye,
  CursorClick,
  Calendar,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { DEMO_ADMIN_BANNERS } from "../data/demo-content-data"
import type { AdminBannerItem } from "../types"

const PLACEMENT_LABELS: Record<string, string> = {
  homepage_hero: "Homepage Hero Carousel",
  category_header: "Category Listing Header",
  listing_sidebar: "Search Sidebar Box",
  mobile_interstitial: "Mobile Interstitial Banner",
}

const PLACEMENT_OPTIONS = [
  { value: "homepage_hero", label: "Homepage Hero Carousel" },
  { value: "category_header", label: "Category Listing Header" },
  { value: "listing_sidebar", label: "Search Sidebar Box" },
  { value: "mobile_interstitial", label: "Mobile Interstitial Banner" },
]

interface BannersManagerProps {
  initialBanners?: AdminBannerItem[]
}

export function BannersManager({ initialBanners = DEMO_ADMIN_BANNERS }: BannersManagerProps) {
  const [banners, setBanners] = useState<AdminBannerItem[]>(initialBanners)
  const [filterPlacement, setFilterPlacement] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [placement, setPlacement] = useState<AdminBannerItem["placement"]>("homepage_hero")
  const [targetUrl, setTargetUrl] = useState("")

  const toggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={filterPlacement === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPlacement("all")}
            className="text-xs font-semibold h-8 rounded-lg cursor-pointer"
          >
            All Placements
          </Button>
          <Button
            variant={filterPlacement === "homepage_hero" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPlacement("homepage_hero")}
            className="text-xs font-semibold h-8 rounded-lg cursor-pointer"
          >
            Hero ({banners.filter((b) => b.placement === "homepage_hero").length})
          </Button>
          <Button
            variant={filterPlacement === "category_header" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPlacement("category_header")}
            className="text-xs font-semibold h-8 rounded-lg cursor-pointer"
          >
            Category Header ({banners.filter((b) => b.placement === "category_header").length})
          </Button>
        </div>

        <Button
          size="sm"
          onClick={() => setAddDialogOpen(true)}
          className="text-xs font-bold gap-1.5 h-8.5 rounded-lg cursor-pointer"
        >
          <Plus size={14} weight="bold" />
          <span>Add Promotional Banner</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden bg-card rounded-xl border-0 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="h-32 bg-muted/60 relative flex items-center justify-center border-b border-border/60">
                <div className="text-center space-y-1 p-2">
                  <ImageIcon size={24} className="mx-auto text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-mono block truncate">
                    {banner.imageUrl}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-[10px] bg-background/90 backdrop-blur-xs font-semibold">
                    {PLACEMENT_LABELS[banner.placement] || banner.placement}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="size-7 bg-background/80 backdrop-blur-xs text-foreground"
                          aria-label="Banner options"
                        >
                          <DotsThreeVertical size={14} weight="bold" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-32 text-xs">
                      <DropdownMenuItem className="text-xs">
                        <Pencil size={12} className="mr-1.5" />
                        Edit Banner
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-destructive">
                        <Trash size={12} className="mr-1.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-3.5 space-y-2 text-xs">
                <h3 className="font-bold text-foreground leading-snug line-clamp-1">{banner.title}</h3>
                <span className="text-[11px] text-muted-foreground font-mono block truncate">
                  Target: {banner.targetUrl}
                </span>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
                  <Calendar size={12} />
                  <span>
                    {banner.startDate} → {banner.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {banner.viewsCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <CursorClick size={12} />
                  {banner.clicksCount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {banner.isActive ? "Active" : "Paused"}
                </span>
                <Switch
                  checked={banner.isActive}
                  onCheckedChange={() => toggleBanner(banner.id)}
                  aria-label="Toggle banner status"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-base font-bold text-foreground">Schedule New Banner</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new promotional banner campaign to the marketplace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Field>
              <FieldLabel required>Campaign / Banner Title</FieldLabel>
              <Input
                placeholder="e.g. Water Festival Holiday Promo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9.5 text-xs rounded-lg"
              />
            </Field>

            <Field>
              <FieldLabel required>Display Placement Slot</FieldLabel>
              <Select
                value={placement}
                items={PLACEMENT_OPTIONS}
                onValueChange={(val) => setPlacement(val ?? "homepage_hero")}
              >
                <SelectTrigger size="sm" className="h-9.5 text-xs w-full rounded-lg">
                  <SelectValue placeholder="Placement">
                    {(val) => getSelectOptionLabel(PLACEMENT_OPTIONS, val, "Placement")}
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
            </Field>

            <Field>
              <FieldLabel required>Target URL / Destination</FieldLabel>
              <Input
                placeholder="e.g. /category/vehicles"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="h-9.5 text-xs font-mono rounded-lg"
              />
            </Field>
          </div>

          <DialogFooter className="flex-row gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(false)}
              className="h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setAddDialogOpen(false)}
              className="h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              Save Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
