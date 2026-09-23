"use client"

import { useState } from "react"
import {
  MagnifyingGlass,
  Funnel,
  ArrowCounterClockwise,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
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
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { ADMIN_CATEGORY_FILTER_OPTIONS } from "@/features/admin/categories/data/demo-admin-categories"

interface ListingToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  sellerTypeFilter: string
  onSellerTypeChange: (value: string) => void
  provinceFilter: string
  onProvinceChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
  totalCount: number
  filteredCount: number
}

const CATEGORY_OPTIONS = ADMIN_CATEGORY_FILTER_OPTIONS

const SELLER_TYPE_OPTIONS = [
  { value: "all", label: "All Seller Types" },
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
  { value: "dealer", label: "Dealer" },
]

const PROVINCE_OPTIONS = [
  { value: "all", label: "All Provinces" },
  { value: "Phnom Penh", label: "Phnom Penh" },
  { value: "Siem Reap", label: "Siem Reap" },
  { value: "Battambang", label: "Battambang" },
  { value: "Kandal", label: "Kandal" },
  { value: "Preah Sihanouk", label: "Preah Sihanouk" },
  { value: "Kampot", label: "Kampot" },
]

export function ListingToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sellerTypeFilter,
  onSellerTypeChange,
  provinceFilter,
  onProvinceChange,
  onReset,
  hasActiveFilters,
}: ListingToolbarProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  return (
    <div className="p-3.5 sm:p-4 border-b border-border/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-muted/10">
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlass
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search listing title, ID, seller or location..."
          className="h-9 w-full pl-9 pr-3 text-xs bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        />
      </div>

      <div className="hidden lg:flex items-center gap-2 flex-wrap">
        <div className="w-44">
          <Select
            items={CATEGORY_OPTIONS}
            value={categoryFilter || "all"}
            onValueChange={(val) => onCategoryChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-background rounded-lg">
              <SelectValue placeholder="All Categories">
                {(val) => getSelectOptionLabel(CATEGORY_OPTIONS, val, "All Categories")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <Select
            items={SELLER_TYPE_OPTIONS}
            value={sellerTypeFilter || "all"}
            onValueChange={(val) => onSellerTypeChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-background rounded-lg">
              <SelectValue placeholder="All Seller Types">
                {(val) => getSelectOptionLabel(SELLER_TYPE_OPTIONS, val, "All Seller Types")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {SELLER_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select
            items={PROVINCE_OPTIONS}
            value={provinceFilter || "all"}
            onValueChange={(val) => onProvinceChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-background rounded-lg">
              <SelectValue placeholder="All Provinces">
                {(val) => getSelectOptionLabel(PROVINCE_OPTIONS, val, "All Provinces")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {PROVINCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer rounded-lg"
          >
            <ArrowCounterClockwise size={13} />
            <span>Reset</span>
          </Button>
        )}
      </div>

      <div className="flex lg:hidden items-center justify-between gap-2">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs font-semibold gap-1.5 rounded-lg flex-1 cursor-pointer bg-background"
              >
                <Funnel size={14} />
                <span>Filters {hasActiveFilters && "(Active)"}</span>
              </Button>
            }
          />
          <SheetContent side="bottom" className="p-4 rounded-t-xl max-h-[85dvh] space-y-4">
            <SheetHeader>
              <SheetTitle className="text-sm font-bold">Filter Listings</SheetTitle>
            </SheetHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <Select
                  items={CATEGORY_OPTIONS}
                  value={categoryFilter || "all"}
                  onValueChange={(val) => onCategoryChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-lg">
                    <SelectValue placeholder="All Categories">
                      {(val) => getSelectOptionLabel(CATEGORY_OPTIONS, val, "All Categories")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Seller Type</label>
                <Select
                  items={SELLER_TYPE_OPTIONS}
                  value={sellerTypeFilter || "all"}
                  onValueChange={(val) => onSellerTypeChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-lg">
                    <SelectValue placeholder="All Seller Types">
                      {(val) => getSelectOptionLabel(SELLER_TYPE_OPTIONS, val, "All Seller Types")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {SELLER_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Province</label>
                <Select
                  items={PROVINCE_OPTIONS}
                  value={provinceFilter || "all"}
                  onValueChange={(val) => onProvinceChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-lg">
                    <SelectValue placeholder="All Provinces">
                      {(val) => getSelectOptionLabel(PROVINCE_OPTIONS, val, "All Provinces")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {PROVINCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SheetFooter className="flex-row gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex-1 text-xs rounded-lg"
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => setMobileSheetOpen(false)}
                className="flex-1 text-xs font-bold rounded-lg"
              >
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
