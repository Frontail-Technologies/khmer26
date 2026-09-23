"use client"

import { useState, useMemo } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
} from "@tanstack/react-table"
import { MagnifyingGlass, ArrowCounterClockwise } from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { promotionColumns } from "../columns"
import type { ActivePromotionItem } from "../types"

interface PromotionTableProps {
  initialPromotions: ActivePromotionItem[]
}

const TYPE_OPTIONS = [
  { value: "all", label: "All Promotion Types" },
  { value: "featured", label: "Featured Spotlight" },
  { value: "top_category", label: "Top Category" },
  { value: "urgent", label: "Urgent Badge" },
  { value: "daily_bump", label: "Daily Bump" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
]

export function PromotionTable({ initialPromotions }: PromotionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startedAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = useMemo(() => {
    return initialPromotions.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = item.listingTitle.toLowerCase().includes(q)
        const matchesSeller = item.sellerName.toLowerCase().includes(q)
        const matchesRef = item.paymentReference?.toLowerCase().includes(q) ?? false
        const matchesId = item.id.toLowerCase().includes(q)
        if (!matchesTitle && !matchesSeller && !matchesRef && !matchesId) {
          return false
        }
      }

      if (typeFilter !== "all" && item.promotionType !== typeFilter) {
        return false
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [initialPromotions, searchQuery, typeFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns: promotionColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const hasActiveFilters = Boolean(searchQuery) || typeFilter !== "all" || statusFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search promotions by listing, seller, or payment ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9.5 pl-9.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val ?? "all")}>
            <SelectTrigger className="h-9.5 text-xs w-[170px]">
              <SelectValue placeholder="All Promotion Types" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
            <SelectTrigger className="h-9.5 text-xs w-[130px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
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
              onClick={handleReset}
              className="h-9.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowCounterClockwise size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 overflow-x-auto">
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
                    className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80"
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
                  className="transition-colors hover:bg-muted/25 border-b border-border/60 h-14"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <DataTableEmpty
                colSpan={promotionColumns.length}
                title="No promotions found"
                description="Try adjusting your search criteria or active filters."
              />
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
