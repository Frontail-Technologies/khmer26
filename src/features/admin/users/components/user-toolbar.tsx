"use client"

import { useMemo } from "react"
import { AdminFilterBar, AdminFilterSelect } from "@/components/admin/admin-filter-bar"
import { useAdminProvinces } from "@/features/admin/locations/hooks/locations.queries"

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
}: UserToolbarProps) {
  const { data: provinces = [] } = useAdminProvinces()
  const PROVINCE_OPTIONS = useMemo(
    () => [
      { value: "all", label: "All Provinces" },
      ...provinces.map((p) => ({ value: p.name, label: p.name })),
    ],
    [provinces]
  )
  const activeCount = [accountTypeFilter, statusFilter, verificationFilter, provinceFilter].filter(
    (value) => value && value !== "all"
  ).length

  return (
    <AdminFilterBar
      search={{ value: searchQuery, onChange: onSearchChange, placeholder: "Search users" }}
      activeCount={activeCount}
      onReset={onReset}
    >
      <AdminFilterSelect label="Account type" value={accountTypeFilter || "all"} onChange={onAccountTypeChange} options={ACCOUNT_TYPE_OPTIONS} widthClassName="w-32" />
      <AdminFilterSelect label="Status" value={statusFilter || "all"} onChange={onStatusChange} options={STATUS_OPTIONS} widthClassName="w-36" />
      <AdminFilterSelect label="Verification" value={verificationFilter || "all"} onChange={onVerificationChange} options={VERIFICATION_OPTIONS} widthClassName="w-40" />
      <AdminFilterSelect label="Province" value={provinceFilter || "all"} onChange={onProvinceChange} options={PROVINCE_OPTIONS} />
    </AdminFilterBar>
  )
}
