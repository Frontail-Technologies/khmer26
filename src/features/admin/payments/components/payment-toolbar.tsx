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
  type SelectOption,
} from "@/components/ui/select"

interface PaymentToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  gatewayFilter: string
  onGatewayChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  purposeFilter: string
  onPurposeChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
  totalCount: number
  filteredCount: number
}

const GATEWAY_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Gateways" },
  { value: "bakong", label: "Bakong KHQR" },
  { value: "aba", label: "ABA PayWay" },
  { value: "acleda", label: "ACLEDA Bank" },
  { value: "wing", label: "Wing Bank" },
  { value: "card", label: "Credit / Debit Card" },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
]

const PURPOSE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Purposes" },
  { value: "promotion", label: "Ad Promotions" },
  { value: "subscription", label: "Subscriptions" },
]

export function PaymentToolbar({
  searchQuery,
  onSearchChange,
  gatewayFilter,
  onGatewayChange,
  statusFilter,
  onStatusChange,
  purposeFilter,
  onPurposeChange,
  onReset,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: PaymentToolbarProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by txn ID, reference, payer name, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Select
            value={gatewayFilter}
            items={GATEWAY_OPTIONS}
            onValueChange={(val) => onGatewayChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[140px]">
              <SelectValue placeholder="Gateway">
                {(val) => getSelectOptionLabel(GATEWAY_OPTIONS, val, "Gateway")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {GATEWAY_OPTIONS.map((opt) => (
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
            <SelectTrigger className="h-9 text-xs w-[130px]">
              <SelectValue placeholder="Status">
                {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "Status")}
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
            value={purposeFilter}
            items={PURPOSE_OPTIONS}
            onValueChange={(val) => onPurposeChange(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[140px]">
              <SelectValue placeholder="Purpose">
                {(val) => getSelectOptionLabel(PURPOSE_OPTIONS, val, "Purpose")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PURPOSE_OPTIONS.map((opt) => (
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
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
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
          <span className="font-semibold text-foreground">{totalCount}</span> transactions
        </span>
      </div>
    </div>
  )
}
