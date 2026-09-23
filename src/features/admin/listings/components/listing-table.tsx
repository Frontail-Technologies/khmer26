"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table"
import {
  CheckCircle,
  UserGear,
  X,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { ListingToolbar } from "./listing-toolbar"
import { ListingMobileCards } from "./listing-mobile-cards"
import { listingColumns } from "../columns"
import type { AdminListing } from "../types"
import { cn } from "@/lib/utils"

interface ListingTableProps {
  initialData: AdminListing[]
}

type ListingTabKey = "all" | "active" | "pending" | "flagged" | "rejected" | "sold" | "expired"

export function ListingTable({ initialData }: ListingTableProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ListingTabKey>("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sellerTypeFilter, setSellerTypeFilter] = useState("")
  const [provinceFilter, setProvinceFilter] = useState("")
  const [mobileSort, setMobileSort] = useState("newest")

  const counts = useMemo(() => {
    return {
      all: initialData.length,
      active: initialData.filter((i) => i.status === "active").length,
      pending: 14,
      flagged: 8,
      rejected: initialData.filter((i) => i.status === "rejected").length,
      sold: initialData.filter((i) => i.status === "sold").length,
      expired: initialData.filter((i) => i.status === "expired").length,
    }
  }, [initialData])

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      if (activeTab !== "all" && item.status !== activeTab) return false
      if (categoryFilter && item.categoryId !== categoryFilter) return false
      if (sellerTypeFilter && item.seller.sellerType !== sellerTypeFilter) return false
      if (provinceFilter && item.location.province !== provinceFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesTitle = item.title.toLowerCase().includes(q)
        const matchesId = item.id.toLowerCase().includes(q)
        const matchesSeller = item.seller.name.toLowerCase().includes(q)
        const matchesCategory = item.categoryName.toLowerCase().includes(q)
        const matchesLocation = item.location.province.toLowerCase().includes(q)
        if (
          !matchesTitle &&
          !matchesId &&
          !matchesSeller &&
          !matchesCategory &&
          !matchesLocation
        ) {
          return false
        }
      }
      return true
    })
  }, [
    initialData,
    activeTab,
    searchQuery,
    categoryFilter,
    sellerTypeFilter,
    provinceFilter,
  ])

  const table = useReactTable({
    data: filteredData,
    columns: listingColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const selectedCount = Object.keys(rowSelection).length

  const handleMobileSortChange = (val: string) => {
    setMobileSort(val)
    if (val === "newest") {
      setSorting([{ id: "createdDate", desc: true }])
    } else if (val === "oldest") {
      setSorting([{ id: "createdDate", desc: false }])
    } else if (val === "price_desc") {
      setSorting([{ id: "price", desc: true }])
    } else if (val === "price_asc") {
      setSorting([{ id: "price", desc: false }])
    }
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
      categoryFilter ||
      sellerTypeFilter ||
      provinceFilter
  )

  const handleReset = () => {
    setSearchQuery("")
    setCategoryFilter("")
    setSellerTypeFilter("")
    setProvinceFilter("")
  }

  const tabs: { key: ListingTabKey; label: string; count?: number; urgent?: boolean; warning?: boolean }[] = [
    { key: "all", label: "All Listings", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "pending", label: "Pending Review", count: counts.pending, warning: true },
    { key: "flagged", label: "Flagged", count: counts.flagged, urgent: true },
    { key: "rejected", label: "Rejected" },
    { key: "sold", label: "Sold" },
    { key: "expired", label: "Expired" },
  ]

  return (
    <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden flex flex-col">
      <div className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key)
                  setRowSelection({})
                }}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 border-transparent",
                  isActive
                    ? "bg-card text-foreground border-primary shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 h-4 text-[10px] font-bold rounded-md border",
                      tab.urgent
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        : tab.warning
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : isActive
                        ? "bg-muted text-foreground border-border"
                        : "bg-background/80 text-muted-foreground border-border/60"
                    )}
                  >
                    {tab.count}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <ListingToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sellerTypeFilter={sellerTypeFilter}
        onSellerTypeChange={setSellerTypeFilter}
        provinceFilter={provinceFilter}
        onProvinceChange={setProvinceFilter}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialData.length}
        filteredCount={filteredData.length}
      />

      {selectedCount > 0 && (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-md text-[11px]">
              {selectedCount}
            </span>
            <span>listings selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              onClick={() => {
                setRowSelection({})
              }}
            >
              <CheckCircle size={14} weight="bold" />
              <span>Approve Selected</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
              onClick={() => {
                setRowSelection({})
              }}
            >
              <UserGear size={14} weight="bold" />
              <span>Assign Moderator</span>
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setRowSelection({}) }
              aria-label="Clear selection"
            >
              <X size={14} weight="bold" />
            </Button>
          </div>
        </div>
      )}

      <div className="hidden md:block flex-1">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/60 dark:bg-muted/90 hover:bg-muted/60 dark:hover:bg-muted/90 border-b border-border/80 select-none"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-2.5 px-3.5 text-[11px] font-bold text-muted-foreground dark:text-foreground/80"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => router.push(`/admin/listings/${row.original.id}`)}
                    className="transition-colors hover:bg-muted/30 border-b border-border/60 cursor-pointer h-16"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 px-3.5 text-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableEmpty
                  colSpan={listingColumns.length}
                  title="No listings found"
                  description="Try adjusting your search terms, status tabs, or active filters."
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="block md:hidden p-3.5">
        <ListingMobileCards
          data={filteredData}
          sortBy={mobileSort}
          onSortChange={handleMobileSortChange}
        />
      </div>

      <div className="border-t border-border/60 bg-muted/10 p-2 sm:p-3">
        <DataTablePagination table={table} />
      </div>
    </Card>
  )
}
