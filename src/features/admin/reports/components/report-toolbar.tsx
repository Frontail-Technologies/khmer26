"use client"

import { AdminFilterBar, AdminFilterSelect } from "@/components/admin/admin-filter-bar"

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
}: ReportToolbarProps) {
  const activeCount = [statusFilter, targetTypeFilter, reasonFilter].filter((value) => value && value !== "all").length
  const fromAll = (setter: (value: string) => void) => (value: string) => setter(value === "all" ? "" : value)

  return (
    <AdminFilterBar
      search={{ value: searchQuery, onChange: onSearchChange, placeholder: "Search reports" }}
      activeCount={activeCount}
      onReset={onReset}
    >
      <AdminFilterSelect label="Target" value={targetTypeFilter || "all"} onChange={fromAll(onTargetTypeChange)} options={TARGET_TYPE_OPTIONS} widthClassName="w-40" />
      <AdminFilterSelect label="Status" value={statusFilter || "all"} onChange={fromAll(onStatusChange)} options={STATUS_OPTIONS} widthClassName="w-36" />
      <AdminFilterSelect label="Reason" value={reasonFilter || "all"} onChange={fromAll(onReasonChange)} options={REASON_OPTIONS} widthClassName="w-44" />
    </AdminFilterBar>
  )
}
