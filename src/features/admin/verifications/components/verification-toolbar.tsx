"use client"

import { AdminFilterBar, AdminFilterSelect } from "@/components/admin/admin-filter-bar"

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
}: VerificationToolbarProps) {
  const activeCount = [statusFilter, typeFilter, sellerTypeFilter].filter(Boolean).length
  const fromAll = (setter: (value: string) => void) => (value: string) => setter(value === "all" ? "" : value)

  return (
    <AdminFilterBar
      search={{ value: searchQuery, onChange: onSearchChange, placeholder: "Search requests" }}
      activeCount={activeCount}
      onReset={onReset}
    >
      <AdminFilterSelect label="Verification type" value={typeFilter || "all"} onChange={fromAll(onTypeChange)} options={TYPE_OPTIONS} widthClassName="w-48" />
      <AdminFilterSelect label="Status" value={statusFilter || "all"} onChange={fromAll(onStatusChange)} options={STATUS_OPTIONS} widthClassName="w-36" />
      <AdminFilterSelect label="Seller type" value={sellerTypeFilter || "all"} onChange={fromAll(onSellerTypeChange)} options={SELLER_TYPE_OPTIONS} widthClassName="w-36" />
    </AdminFilterBar>
  )
}
