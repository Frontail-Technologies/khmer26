"use client"

import { AdminFilterBar, AdminFilterSelect } from "@/components/admin/admin-filter-bar"

interface ListingToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  sellerTypeFilter: string
  onSellerTypeChange: (value: string) => void
  provinceFilter: string
  onProvinceChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
  sortOrder?: "newest" | "oldest" | "price_asc" | "price_desc"
  onSortOrderChange?: (value: "newest" | "oldest" | "price_asc" | "price_desc") => void
  categoryOptions: { value: string; label: string }[]
  provinceOptions: { value: string; label: string }[]
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

const SELLER_TYPE_OPTIONS = [
  { value: "all", label: "All Seller Types" },
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
  { value: "dealer", label: "Dealer" },
]

export function ListingToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sellerTypeFilter,
  onSellerTypeChange,
  provinceFilter,
  onProvinceChange,
  onReset,
  sortOrder = "newest",
  onSortOrderChange,
  categoryOptions,
  provinceOptions,
}: ListingToolbarProps) {
  const categories = [{ value: "all", label: "All Categories" }, ...categoryOptions]
  const provinces = [{ value: "all", label: "All Provinces" }, ...provinceOptions]
  const activeCount = [categoryFilter, sellerTypeFilter, provinceFilter].filter(Boolean).length
  const fromAll = (setter: (value: string) => void) => (value: string) => setter(value === "all" ? "" : value)

  return (
    <AdminFilterBar
      search={{ value: searchQuery, onChange: onSearchChange, placeholder: "Search listings" }}
      activeCount={activeCount}
      onReset={onReset}
    >
      <AdminFilterSelect label="Category" value={categoryFilter || "all"} onChange={fromAll(onCategoryChange)} options={categories} widthClassName="w-44" />
      <AdminFilterSelect label="Seller type" value={sellerTypeFilter || "all"} onChange={fromAll(onSellerTypeChange)} options={SELLER_TYPE_OPTIONS} widthClassName="w-36" />
      <AdminFilterSelect label="Province" value={provinceFilter || "all"} onChange={fromAll(onProvinceChange)} options={provinces} />
      {onSortOrderChange && (
        <AdminFilterSelect
          label="Sort"
          value={sortOrder}
          onChange={(value) => onSortOrderChange(value as NonNullable<ListingToolbarProps["sortOrder"]>)}
          options={SORT_OPTIONS}
          widthClassName="w-40"
        />
      )}
    </AdminFilterBar>
  )
}
