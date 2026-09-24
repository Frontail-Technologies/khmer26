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

interface ReportToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  targetTypeFilter: string
  onTargetTypeChange: (value: string) => void
  reasonFilter: string
  onReasonChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
  totalCount: number
  filteredCount: number
}

const TARGET_TYPE_OPTIONS = [
  { value: "all", label: "All Target Types" },
  { value: "listing", label: "Listings" },
  { value: "user", label: "Users & Sellers" },
  { value: "chat", label: "Chats & Messages" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
]

const REASON_OPTIONS = [
  { value: "all", label: "All Reasons" },
  { value: "suspected_scam", label: "Suspected Scam" },
  { value: "misleading", label: "Misleading Information" },
  { value: "duplicate", label: "Duplicate Listing" },
  { value: "spam", label: "Spam / Messages" },
  { value: "wrong_category", label: "Wrong Category" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "prohibited_item", label: "Prohibited Item" },
  { value: "harassment", label: "Harassment" },
  { value: "suspicious_account", label: "Suspicious Account" },
]

export function ReportToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  targetTypeFilter,
  onTargetTypeChange,
  reasonFilter,
  onReasonChange,
  onReset,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: ReportToolbarProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

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
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reporter, reported item, report ID or reason..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <Select
            value={targetTypeFilter || "all"}
            items={TARGET_TYPE_OPTIONS}
            onValueChange={(val) => onTargetTypeChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger className="h-9 text-xs w-[140px] rounded-lg">
              <SelectValue>
                {(val) => getSelectOptionLabel(TARGET_TYPE_OPTIONS, val, "All Target Types")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TARGET_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter || "all"}
            items={STATUS_OPTIONS}
            onValueChange={(val) => onStatusChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger className="h-9 text-xs w-[130px] rounded-lg">
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
            value={reasonFilter || "all"}
            items={REASON_OPTIONS}
            onValueChange={(val) => onReasonChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger className="h-9 text-xs w-[150px] rounded-lg">
              <SelectValue>
                {(val) => getSelectOptionLabel(REASON_OPTIONS, val, "All Reasons")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {REASON_OPTIONS.map((opt) => (
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
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
            >
              <ArrowCounterClockwise size={13} />
              <span>Reset</span>
            </Button>
          )}
        </div>

        <div className="flex xl:hidden items-center justify-between gap-2">
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-semibold gap-1.5 rounded-lg flex-1 cursor-pointer"
                >
                  <Funnel size={14} />
                  <span>Filters {hasActiveFilters && "(Active)"}</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-4 space-y-4">
              <SheetHeader>
                <SheetTitle className="text-sm font-semibold">Filter Reports</SheetTitle>
              </SheetHeader>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Target Type</label>
                  <Select
                    value={targetTypeFilter || "all"}
                    items={TARGET_TYPE_OPTIONS}
                    onValueChange={(val) => onTargetTypeChange(val === "all" ? "" : (val ?? ""))}
                  >
                    <SelectTrigger className="h-9 text-xs w-full rounded-lg">
                      <SelectValue>
                        {(val) => getSelectOptionLabel(TARGET_TYPE_OPTIONS, val, "All Target Types")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_TYPE_OPTIONS.map((opt) => (
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
                    value={statusFilter || "all"}
                    items={STATUS_OPTIONS}
                    onValueChange={(val) => onStatusChange(val === "all" ? "" : (val ?? ""))}
                  >
                    <SelectTrigger className="h-9 text-xs w-full rounded-lg">
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
                  <label className="text-xs font-medium text-foreground">Reason</label>
                  <Select
                    value={reasonFilter || "all"}
                    items={REASON_OPTIONS}
                    onValueChange={(val) => onReasonChange(val === "all" ? "" : (val ?? ""))}
                  >
                    <SelectTrigger className="h-9 text-xs w-full rounded-lg">
                      <SelectValue>
                        {(val) => getSelectOptionLabel(REASON_OPTIONS, val, "All Reasons")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {REASON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="flex flex-row gap-2 pt-4">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onReset()
                      setMobileSheetOpen(false)
                    }}
                    className="flex-1 text-xs cursor-pointer"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setMobileSheetOpen(false)}
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
          <span className="font-semibold text-foreground">{totalCount}</span> reports
        </span>
      </div>
    </div>
  )
}
