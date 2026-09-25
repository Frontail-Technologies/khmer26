"use client"

import { MagnifyingGlass, ArrowCounterClockwise } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"

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
  { value: "all", label: "All Types" },
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
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
  filteredCount,
  totalCount,
}: UserToolbarProps) {
  return (
    <div className="px-3.5 sm:px-4 py-3 border-b border-border/60 flex flex-col gap-2.5">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-0">
          <MagnifyingGlass
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search name, ID, email, phone or business..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={accountTypeFilter}
            items={ACCOUNT_TYPE_OPTIONS}
            onValueChange={(val) => onAccountTypeChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[120px]">
              <SelectValue>
                {(val) => getSelectOptionLabel(ACCOUNT_TYPE_OPTIONS, val, "All Types")}
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
            <SelectTrigger className="h-9 text-xs w-[115px]">
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
            <SelectTrigger className="h-9 text-xs w-[120px]">
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
            <SelectTrigger className="h-9 text-xs w-[120px]">
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
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            >
              <ArrowCounterClockwise size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <span className="text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground">{filteredCount}</span>
        {" "}of{" "}
        <span className="font-semibold text-foreground">{totalCount}</span>
        {" "}accounts
      </span>
    </div>
  )
}
