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
  priorityFilter: string
  onPriorityChange: (value: string) => void
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
  { value: "seller", label: "Sellers" },
  { value: "user", label: "Users" },
  { value: "chat", label: "Chat Conversations" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_review", label: "In Review" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
]

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
]

const REASON_OPTIONS = [
  { value: "all", label: "All Reasons" },
  { value: "suspected_scam", label: "Suspected Scam" },
  { value: "misleading", label: "Misleading Information" },
  { value: "duplicate", label: "Duplicate Listing" },
  { value: "spam", label: "Spam / Mass Messaging" },
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
  priorityFilter,
  onPriorityChange,
  reasonFilter,
  onReasonChange,
  onReset,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: ReportToolbarProps) {
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
          placeholder="Search report ID, target title, reporter, or reason..."
          className="h-9 w-full pl-9 pr-3 text-xs bg-muted/40 border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      <div className="hidden xl:flex items-center gap-2 flex-wrap">
        <div className="w-40">
          <Select
            value={targetTypeFilter || "all"}
            items={TARGET_TYPE_OPTIONS}
            onValueChange={(val) => onTargetTypeChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-muted/40 rounded-xl">
              <SelectValue>
                {(val) => getSelectOptionLabel(TARGET_TYPE_OPTIONS, val, "All Target Types")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {TARGET_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
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

        <div className="w-36">
          <Select
            value={priorityFilter || "all"}
            items={PRIORITY_OPTIONS}
            onValueChange={(val) => onPriorityChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-muted/40 rounded-xl">
              <SelectValue>
                {(val) => getSelectOptionLabel(PRIORITY_OPTIONS, val, "All Priorities")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-44">
          <Select
            value={reasonFilter || "all"}
            items={REASON_OPTIONS}
            onValueChange={(val) => onReasonChange(val === "all" ? "" : (val ?? ""))}
          >
            <SelectTrigger size="sm" className="h-9 text-xs bg-muted/40 rounded-xl">
              <SelectValue>
                {(val) => getSelectOptionLabel(REASON_OPTIONS, val, "All Reasons")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              {REASON_OPTIONS.map((opt) => (
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

      <div className="flex xl:hidden items-center justify-between gap-2">
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
              <SheetTitle className="text-sm font-bold">Filter Reports</SheetTitle>
            </SheetHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Type</label>
                <Select
                  value={targetTypeFilter || "all"}
                  items={TARGET_TYPE_OPTIONS}
                  onValueChange={(val) => onTargetTypeChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-xl">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(TARGET_TYPE_OPTIONS, val, "All Target Types")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {TARGET_TYPE_OPTIONS.map((opt) => (
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
                <label className="text-xs font-semibold text-foreground">Priority</label>
                <Select
                  value={priorityFilter || "all"}
                  items={PRIORITY_OPTIONS}
                  onValueChange={(val) => onPriorityChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-xl">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(PRIORITY_OPTIONS, val, "All Priorities")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Reason</label>
                <Select
                  value={reasonFilter || "all"}
                  items={REASON_OPTIONS}
                  onValueChange={(val) => onReasonChange(val === "all" ? "" : (val ?? ""))}
                >
                  <SelectTrigger size="default" className="h-10 text-xs bg-background rounded-xl">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(REASON_OPTIONS, val, "All Reasons")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {REASON_OPTIONS.map((opt) => (
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
