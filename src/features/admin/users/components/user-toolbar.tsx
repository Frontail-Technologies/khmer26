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

interface UserToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  accountTypeFilter: string
  onAccountTypeChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  verificationFilter: string
  onVerificationChange: (value: string) => void
  provinceFilter: string
  onProvinceChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
  totalCount: number
  filteredCount: number
}

const ACCOUNT_TYPE_OPTIONS = [
  { value: "all", label: "All Account Types" },
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Individual Seller" },
  { value: "business", label: "Business" },
  { value: "dealer", label: "Dealer" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "restricted", label: "Restricted" },
]

const VERIFICATION_OPTIONS = [
  { value: "all", label: "All Verifications" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "unverified", label: "Unverified" },
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

export function UserToolbar({
  searchQuery,
  onSearchChange,
  accountTypeFilter,
  onAccountTypeChange,
  statusFilter,
  onStatusChange,
  verificationFilter,
  onVerificationChange,
  provinceFilter,
  onProvinceChange,
  onReset,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: UserToolbarProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  return (
    <div className="p-3.5 sm:p-4 border-b border-border/60 space-y-2.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search name, account ID, email, phone or business..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <Select
            value={accountTypeFilter}
            items={ACCOUNT_TYPE_OPTIONS}
            onValueChange={(val) => onAccountTypeChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[145px]">
              <SelectValue>
                {(val) => getSelectOptionLabel(ACCOUNT_TYPE_OPTIONS, val, "All Account Types")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            items={STATUS_OPTIONS}
            onValueChange={(val) => onStatusChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[125px]">
              <SelectValue>
                {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "All Statuses")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={verificationFilter}
            items={VERIFICATION_OPTIONS}
            onValueChange={(val) => onVerificationChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[135px]">
              <SelectValue>
                {(val) => getSelectOptionLabel(VERIFICATION_OPTIONS, val, "All Verifications")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {VERIFICATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={provinceFilter}
            items={PROVINCE_OPTIONS}
            onValueChange={(val) => onProvinceChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[135px]">
              <SelectValue>
                {(val) => getSelectOptionLabel(PROVINCE_OPTIONS, val, "All Provinces")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PROVINCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowCounterClockwise size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex xl:hidden items-center justify-between gap-2">
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm" className="h-9 text-xs flex-1 cursor-pointer">
                  <Funnel size={14} className="mr-1.5" />
                  Filters {hasActiveFilters && "(Active)"}
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-4 space-y-4">
              <SheetHeader>
                <SheetTitle className="text-sm font-semibold">Filter Accounts</SheetTitle>
              </SheetHeader>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Account Type</label>
                  <Select
                    value={accountTypeFilter}
                    items={ACCOUNT_TYPE_OPTIONS}
                    onValueChange={(val) => onAccountTypeChange(val ?? "all")}
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue>
                        {(val) => getSelectOptionLabel(ACCOUNT_TYPE_OPTIONS, val, "All Account Types")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Status</label>
                  <Select
                    value={statusFilter}
                    items={STATUS_OPTIONS}
                    onValueChange={(val) => onStatusChange(val ?? "all")}
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue>
                        {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "All Statuses")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Verification</label>
                  <Select
                    value={verificationFilter}
                    items={VERIFICATION_OPTIONS}
                    onValueChange={(val) => onVerificationChange(val ?? "all")}
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue>
                        {(val) => getSelectOptionLabel(VERIFICATION_OPTIONS, val, "All Verifications")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {VERIFICATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Province</label>
                  <Select
                    value={provinceFilter}
                    items={PROVINCE_OPTIONS}
                    onValueChange={(val) => onProvinceChange(val ?? "all")}
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue>
                        {(val) => getSelectOptionLabel(PROVINCE_OPTIONS, val, "All Provinces")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="flex-row gap-2 pt-4">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onReset()
                      setMobileFilterOpen(false)
                    }}
                    className="flex-1 text-xs cursor-pointer"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 text-xs cursor-pointer"
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowCounterClockwise size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
        <span>
          Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
          <span className="font-semibold text-foreground">{totalCount}</span> accounts
        </span>
      </div>
    </div>
  )
}
