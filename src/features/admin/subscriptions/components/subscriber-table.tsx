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
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { subscriberColumns } from "../columns"
import type { SubscriberRecord } from "../types"

interface SubscriberTableProps {
  initialSubscribers: SubscriberRecord[]
}

const PLAN_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Subscription Plans" },
  { value: "pro", label: "Pro Verified Seller" },
  { value: "business", label: "Business & Dealership" },
  { value: "enterprise", label: "Enterprise Brand Store" },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past Due" },
  { value: "canceled", label: "Canceled" },
  { value: "trialing", label: "Trialing" },
]

export function SubscriberTable({ initialSubscribers }: SubscriberTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startedAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = useMemo(() => {
    return initialSubscribers.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesSeller = item.sellerName.toLowerCase().includes(q)
        const matchesBiz = item.businessName?.toLowerCase().includes(q) ?? false
        const matchesId = item.sellerId.toLowerCase().includes(q)
        const matchesRef = item.paymentReference?.toLowerCase().includes(q) ?? false
        if (!matchesSeller && !matchesBiz && !matchesId && !matchesRef) {
          return false
        }
      }

      if (planFilter !== "all" && item.planTier !== planFilter) {
        return false
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [initialSubscribers, searchQuery, planFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns: subscriberColumns,
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

  const hasActiveFilters = Boolean(searchQuery) || planFilter !== "all" || statusFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setPlanFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="min-w-0 rounded-xl bg-card overflow-hidden shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search subscribed merchants, dealers, or account IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9.5 pl-9.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Select
            value={planFilter}
            items={PLAN_OPTIONS}
            onValueChange={(val) => setPlanFilter(val ?? "all")}
          >
            <SelectTrigger className="h-9.5 text-xs w-[170px]">
              <SelectValue placeholder="All Subscription Plans">
                {(val) => getSelectOptionLabel(PLAN_OPTIONS, val, "All Subscription Plans")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            items={STATUS_OPTIONS}
            onValueChange={(val) => setStatusFilter(val ?? "all")}
          >
            <SelectTrigger className="h-9.5 text-xs w-[130px]">
              <SelectValue placeholder="All Statuses">
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

      <div className="border-t border-border/60">
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
                colSpan={subscriberColumns.length}
                title="No subscribers found"
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
