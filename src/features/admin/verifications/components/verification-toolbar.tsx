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

interface VerificationToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  sellerTypeFilter: string
  onSellerTypeChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
  totalCount: number
  filteredCount: number
}

const TYPE_OPTIONS = [
  { value: "all", label: "All Verification Types" },
  { value: "identity", label: "Identity Verification" },
  { value: "business", label: "Business Verification" },
  { value: "dealer", label: "Dealer Verification" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const SELLER_TYPE_OPTIONS = [
  { value: "all", label: "All Seller Types" },
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
  { value: "dealer", label: "Dealer" },
]

export function VerificationToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sellerTypeFilter,
  onSellerTypeChange,
  onReset,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: VerificationToolbarProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlass
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search seller, email, phone or request ID..."
          className="h-9 w-full pl-9 pr-3 text-xs bg-muted/40 border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <div className="min-w-44">
          <Select
            value={typeFilter || "all"}
            items={TYPE_OPTIONS}
            onValueChange={(val) => onTypeChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-muted/40 rounded-xl">
              <SelectValue>
                {(val) => getSelectOptionLabel(TYPE_OPTIONS, val, "All Verification Types")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-36">
          <Select
            value={statusFilter || "all"}
            items={STATUS_OPTIONS}
            onValueChange={(val) => onStatusChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-muted/40 rounded-xl">
              <SelectValue>
                {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "All Statuses")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-36">
          <Select
            value={sellerTypeFilter || "all"}
            items={SELLER_TYPE_OPTIONS}
            onValueChange={(val) => onSellerTypeChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-muted/40 rounded-xl">
              <SelectValue>
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

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
          >
            <ArrowCounterClockwise size={13} />
            <span>Reset</span>
          </Button>
        )}
      </div>

      <div className="flex md:hidden items-center justify-between gap-2">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs font-semibold gap-1.5 rounded-xl flex-1 cursor-pointer"
              >
                <Funnel size={14} />
                <span>Filters {hasActiveFilters && "(Active)"}</span>
              </Button>
            }
          />
          <SheetContent side="bottom" className="p-4 rounded-t-2xl max-h-[85dvh] space-y-4">
            <SheetHeader>
              <SheetTitle className="text-sm font-bold">Filter Verifications</SheetTitle>
            </SheetHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Verification Type</label>
                <Select
                  value={typeFilter || "all"}
                  items={TYPE_OPTIONS}
                  onValueChange={(val) => onTypeChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-xl">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(TYPE_OPTIONS, val, "All Verification Types")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status</label>
                <Select
                  value={statusFilter || "all"}
                  items={STATUS_OPTIONS}
                  onValueChange={(val) => onStatusChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-xl">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "All Statuses")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {STATUS_OPTIONS.map((opt) => (
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
                  value={sellerTypeFilter || "all"}
                  items={SELLER_TYPE_OPTIONS}
                  onValueChange={(val) => onSellerTypeChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-xl">
                    <SelectValue>
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
            </div>

            <SheetFooter className="flex flex-row gap-2 pt-3">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onReset()
                    setMobileSheetOpen(false)
                  }}
                  className="flex-1 h-9.5 text-xs rounded-xl"
                >
                  Reset
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setMobileSheetOpen(false)}
                className="flex-1 h-9.5 text-xs bg-primary text-primary-foreground font-semibold rounded-xl"
              >
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <span className="text-[11px] text-muted-foreground shrink-0">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>
    </div>
  )
}
