"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { FilterState } from "@/features/search/types"
import { PriceRangeFilter } from "@/features/search/components/price-range-filter"
import {
  Funnel,
  ShieldCheck,
  X,
} from "@phosphor-icons/react"

interface MobileFilterSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  onApplyFilters: (filters: FilterState) => void
  totalMatching: number
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

export function MobileFilterSheet({
  isOpen,
  onOpenChange,
  filters,
  onApplyFilters,
  totalMatching,
}: MobileFilterSheetProps) {
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters)

  const handleOpen = (open: boolean) => {
    if (open) {
      setDraftFilters(filters)
    }
    onOpenChange(open)
  }

  const toggleBrand = (brand: string) => {
    const next = draftFilters.brands.includes(brand)
      ? draftFilters.brands.filter((b) => b !== brand)
      : [...draftFilters.brands, brand]
    setDraftFilters({ ...draftFilters, brands: next })
  }

  const toggleCondition = (condition: string) => {
    const next = draftFilters.conditions.includes(condition)
      ? draftFilters.conditions.filter((c) => c !== condition)
      : [...draftFilters.conditions, condition]
    setDraftFilters({ ...draftFilters, conditions: next })
  }

  const toggleFuel = (fuel: string) => {
    const next = draftFilters.fuels.includes(fuel)
      ? draftFilters.fuels.filter((f) => f !== fuel)
      : [...draftFilters.fuels, fuel]
    setDraftFilters({ ...draftFilters, fuels: next })
  }

  const toggleTransmission = (trans: string) => {
    const next = draftFilters.transmissions.includes(trans)
      ? draftFilters.transmissions.filter((t) => t !== trans)
      : [...draftFilters.transmissions, trans]
    setDraftFilters({ ...draftFilters, transmissions: next })
  }

  const toggleSellerType = (type: string) => {
    const next = draftFilters.sellerTypes.includes(type)
      ? draftFilters.sellerTypes.filter((s) => s !== type)
      : [...draftFilters.sellerTypes, type]
    setDraftFilters({ ...draftFilters, sellerTypes: next })
  }

  const handleClear = () => {
    const cleared: FilterState = {
      category: undefined,
      location: undefined,
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      conditions: [],
      fuels: [],
      transmissions: [],
      sellerTypes: [],
      verifiedOnly: false,
    }
    setDraftFilters(cleared)
  }

  const handleApply = () => {
    onApplyFilters(draftFilters)
    onOpenChange(false)
  }

  const activeCount =
    (draftFilters.category ? 1 : 0) +
    (draftFilters.location ? 1 : 0) +
    draftFilters.brands.length +
    (draftFilters.minPrice !== undefined || draftFilters.maxPrice !== undefined ? 1 : 0) +
    (draftFilters.yearFrom !== undefined || draftFilters.yearTo !== undefined ? 1 : 0) +
    draftFilters.conditions.length +
    draftFilters.fuels.length +
    draftFilters.transmissions.length +
    draftFilters.sellerTypes.length +
    (draftFilters.verifiedOnly ? 1 : 0)

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[85vh] max-h-[85vh] rounded-t-2xl p-0 flex flex-col overflow-hidden bg-card z-70"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <Funnel size={18} className="text-primary" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </SheetTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 text-sm">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Category
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setDraftFilters({ ...draftFilters, category: undefined })}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  !draftFilters.category
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                All Vehicles
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDraftFilters({ ...draftFilters, category: cat.id })}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                    draftFilters.category === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Location
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {LOCATIONS.map((loc) => {
                const isAll = loc === "All Locations"
                const isSelected = isAll ? !draftFilters.location : draftFilters.location === loc
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() =>
                      setDraftFilters({
                        ...draftFilters,
                        location: isAll ? undefined : loc,
                      })
                    }
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {loc}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Brand
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map((brand) => {
                const isSelected = draftFilters.brands.includes(brand)
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {brand}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              BUDGET
            </h4>
            <PriceRangeFilter
              minPrice={draftFilters.minPrice}
              maxPrice={draftFilters.maxPrice}
              onChange={(min, max) =>
                setDraftFilters({
                  ...draftFilters,
                  minPrice: min,
                  maxPrice: max,
                })
              }
            />
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Condition
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map((cond) => {
                const isSelected = draftFilters.conditions.includes(cond.id)
                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => toggleCondition(cond.id)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {cond.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Fuel Type
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FUELS.map((fuel) => {
                const isSelected = draftFilters.fuels.includes(fuel)
                return (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => toggleFuel(fuel)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {fuel}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Transmission
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {TRANSMISSIONS.map((trans) => {
                const isSelected = draftFilters.transmissions.includes(trans)
                return (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => toggleTransmission(trans)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {trans}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Seller Type
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {SELLER_TYPES.map((seller) => {
                const isSelected = draftFilters.sellerTypes.includes(seller.id)
                return (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => toggleSellerType(seller.id)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {seller.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 p-1 cursor-pointer select-none">
              <Checkbox
                checked={draftFilters.verifiedOnly ?? false}
                onCheckedChange={(checked) =>
                  setDraftFilters({
                    ...draftFilters,
                    verifiedOnly: Boolean(checked),
                  })
                }
              />
              <span className="flex items-center gap-1 font-medium text-foreground text-xs">
                <ShieldCheck size={16} weight="fill" className="text-primary" />
                Verified sellers only
              </span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 flex items-center gap-3 border-t border-border bg-card p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1 font-medium text-xs h-10 cursor-pointer"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-2 bg-primary text-primary-foreground font-semibold text-xs h-10 shadow-xs cursor-pointer"
          >
            Show {totalMatching} results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
