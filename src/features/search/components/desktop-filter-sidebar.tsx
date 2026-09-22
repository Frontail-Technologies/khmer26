"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { FilterState } from "@/features/search/types"
import { Checkbox } from "@/components/ui/checkbox"
import { PriceRangeFilter } from "@/features/search/components/price-range-filter"
import {
  CaretDown,
  Check,
  Funnel,
  MagnifyingGlass,
  ShieldCheck,
  Tag,
  MapPin,
  Car,
  CurrencyDollar,
  Calendar,
  GasPump,
  Gear,
  User,
} from "@phosphor-icons/react"

interface DesktopFilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearAll: () => void
  className?: string
}

const CATEGORIES = [
  { id: "cars", label: "Cars" },
  { id: "motorcycles", label: "Motorcycles" },
  { id: "trucks", label: "Trucks & Heavy" },
  { id: "parts", label: "Parts & Accessories" },
]

const LOCATIONS = [
  "All Locations",
  "Phnom Penh",
  "Kandal",
  "Siem Reap",
  "Battambang",
  "Sihanoukville",
  "Kampot",
]

const BRANDS = [
  "Toyota",
  "Lexus",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mercedes-Benz",
  "BMW",
  "Mazda",
  "Nissan",
]

const CONDITIONS = [
  { id: "new", label: "New" },
  { id: "like_new", label: "Like New" },
  { id: "good", label: "Good" },
]

const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"]
const TRANSMISSIONS = ["Automatic", "Manual"]
const SELLER_TYPES = [
  { id: "dealer", label: "Dealer" },
  { id: "individual", label: "Individual" },
]

export function DesktopFilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  className,
}: DesktopFilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("")
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    location: true,
    brand: true,
    price: true,
    year: true,
    condition: true,
    fuel: true,
    transmission: true,
    sellerType: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFilterChange({ brands: next })
  }

  const toggleCondition = (condition: string) => {
    const next = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition]
    onFilterChange({ conditions: next })
  }

  const toggleFuel = (fuel: string) => {
    const next = filters.fuels.includes(fuel)
      ? filters.fuels.filter((f) => f !== fuel)
      : [...filters.fuels, fuel]
    onFilterChange({ fuels: next })
  }

  const toggleTransmission = (trans: string) => {
    const next = filters.transmissions.includes(trans)
      ? filters.transmissions.filter((t) => t !== trans)
      : [...filters.transmissions, trans]
    onFilterChange({ transmissions: next })
  }

  const toggleSellerType = (type: string) => {
    const next = filters.sellerTypes.includes(type)
      ? filters.sellerTypes.filter((s) => s !== type)
      : [...filters.sellerTypes, type]
    onFilterChange({ sellerTypes: next })
  }

  const filteredBrands = BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase().trim())
  )

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.location ? 1 : 0) +
    filters.brands.length +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.yearFrom !== undefined || filters.yearTo !== undefined ? 1 : 0) +
    filters.conditions.length +
    filters.fuels.length +
    filters.transmissions.length +
    filters.sellerTypes.length +
    (filters.verifiedOnly ? 1 : 0)

  return (
    <aside
      className={cn(
        "w-64 lg:w-70 shrink-0 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-3.5",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Funnel size={16} className="text-primary" weight="bold" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3 text-xs">
        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("category")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-primary" />
              <span>Category</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.category && "rotate-180"
              )}
            />
          </button>
          {openSections.category && (
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => onFilterChange({ category: undefined })}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors",
                  !filters.category
                    ? "font-semibold text-primary bg-primary/10 ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>All Vehicles</span>
                {!filters.category && <Check size={12} weight="bold" />}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onFilterChange({ category: cat.id })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors",
                    filters.category === cat.id
                      ? "font-semibold text-primary bg-primary/10 ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{cat.label}</span>
                  {filters.category === cat.id && <Check size={12} weight="bold" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("location")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              <span>Location</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.location && "rotate-180"
              )}
            />
          </button>
          {openSections.location && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pr-1">
              {LOCATIONS.map((loc) => {
                const isAll = loc === "All Locations"
                const isSelected = isAll ? !filters.location : filters.location === loc
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => onFilterChange({ location: isAll ? undefined : loc })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors",
                      isSelected
                        ? "font-semibold text-primary bg-primary/10 ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>{loc}</span>
                    {isSelected && <Check size={12} weight="bold" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("brand")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <Car size={14} className="text-primary" />
              <span>Brand {filters.brands.length > 0 && `(${filters.brands.length})`}</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.brand && "rotate-180"
              )}
            />
          </button>
          {openSections.brand && (
            <div className="mt-2 space-y-2">
              <div className="relative">
                <MagnifyingGlass
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Filter brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="h-7.5 w-full rounded-md border border-border bg-background pl-7.5 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {filteredBrands.map((brand) => {
                  const isChecked = filters.brands.includes(brand)
                  return (
                    <label
                      key={brand}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer text-xs select-none transition-colors",
                        isChecked
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <span className="flex-1 truncate">{brand}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("price")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <CurrencyDollar size={14} className="text-primary" />
              <span>BUDGET</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.price && "rotate-180"
              )}
            />
          </button>
          {openSections.price && (
            <div className="mt-3">
              <PriceRangeFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onChange={(min, max) =>
                  onFilterChange({ minPrice: min, maxPrice: max })
                }
              />
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("year")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              <span>Year</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.year && "rotate-180"
              )}
            />
          </button>
          {openSections.year && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder="From (e.g. 2018)"
                value={filters.yearFrom ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    yearFrom: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-muted-foreground text-xs">—</span>
              <input
                type="number"
                placeholder="To (e.g. 2024)"
                value={filters.yearTo ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    yearTo: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("condition")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <span>Condition</span>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.condition && "rotate-180"
              )}
            />
          </button>
          {openSections.condition && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CONDITIONS.map((cond) => {
                const isSelected = filters.conditions.includes(cond.id)
                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => toggleCondition(cond.id)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cond.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("fuel")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <GasPump size={14} className="text-primary" />
              <span>Fuel</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.fuel && "rotate-180"
              )}
            />
          </button>
          {openSections.fuel && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {FUELS.map((fuel) => {
                const isSelected = filters.fuels.includes(fuel)
                return (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => toggleFuel(fuel)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {fuel}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("transmission")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <Gear size={14} className="text-primary" />
              <span>Transmission</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.transmission && "rotate-180"
              )}
            />
          </button>
          {openSections.transmission && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TRANSMISSIONS.map((trans) => {
                const isSelected = filters.transmissions.includes(trans)
                return (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => toggleTransmission(trans)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {trans}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-b border-border/50 pb-3">
          <button
            type="button"
            onClick={() => toggleSection("sellerType")}
            className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
          >
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-primary" />
              <span>Seller Type</span>
            </div>
            <CaretDown
              size={12}
              className={cn(
                "transition-transform duration-200 text-muted-foreground",
                openSections.sellerType && "rotate-180"
              )}
            />
          </button>
          {openSections.sellerType && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SELLER_TYPES.map((seller) => {
                const isSelected = filters.sellerTypes.includes(seller.id)
                return (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => toggleSellerType(seller.id)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {seller.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-2 p-1 cursor-pointer select-none">
            <Checkbox
              checked={filters.verifiedOnly ?? false}
              onCheckedChange={(checked) => onFilterChange({ verifiedOnly: Boolean(checked) })}
            />
            <span className="flex items-center gap-1 font-semibold text-foreground text-xs">
              <ShieldCheck size={16} weight="fill" className="text-primary" />
              Verified sellers only
            </span>
          </label>
        </div>
      </div>
    </aside>
  )
}
