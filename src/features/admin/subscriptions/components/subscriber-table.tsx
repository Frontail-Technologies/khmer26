"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
} from "@tanstack/react-table"
import {
  MagnifyingGlass,
  ArrowCounterClockwise,
  Eye,
  Storefront,
} from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { subscriberColumns } from "../columns"
import type { SubscriberRecord } from "../types"

interface SubscriberTableProps {
  initialSubscribers: SubscriberRecord[]
}

const PLAN_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Plans" },
  { value: "free", label: "Free Plan" },
  { value: "seller_plus", label: "Seller Plus" },
  { value: "business", label: "Business Pro" },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "paused", label: "Paused" },
]

const PLAN_BADGES: Record<string, { label: string; badgeClass: string }> = {
  free: { label: "Free Plan", badgeClass: "bg-muted text-muted-foreground border-border/80" },
  seller_plus: { label: "Seller Plus", badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  business: { label: "Business Pro", badgeClass: "bg-primary/10 text-primary border-primary/20" },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
  paused: { label: "Paused", tone: "warning" },
}

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
        if (!matchesSeller && !matchesBiz && !matchesId) {
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
    <>
      <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search seller, business name, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Select
            value={planFilter}
            items={PLAN_OPTIONS}
            onValueChange={(val) => setPlanFilter(val ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs w-[140px]">
              <SelectValue placeholder="All Plans">
                {(val) => getSelectOptionLabel(PLAN_OPTIONS, val, "All Plans")}
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
            <SelectTrigger className="h-9 text-xs w-[130px]">
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
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowCounterClockwise size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto min-w-0">
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

      <div className="md:hidden divide-y divide-border/60">
        {filteredData.length ? (
          filteredData.map((sub) => {
            const planConfig = PLAN_BADGES[sub.planTier] || {
              label: sub.planName,
              badgeClass: "bg-muted text-muted-foreground border-border/80",
            }
            const statusConf = STATUS_CONFIG[sub.status] || {
              label: sub.status,
              tone: "neutral" as StatusTone,
            }
            const usage = sub.listingUsage
            const pct = Math.round((usage.used / usage.limit) * 100)

            return (
              <div key={sub.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/users/${sub.sellerId}`}
                      className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {sub.businessName || sub.sellerName}
                    </Link>
                    <span className="font-mono text-[10px] text-muted-foreground block">
                      {sub.sellerId}
                    </span>
                  </div>
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold px-2 py-0.5 h-5 ${planConfig.badgeClass}`}
                  >
                    {planConfig.label}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Expires: {sub.expiresAt}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Listing Usage</span>
                    <span className="font-semibold text-foreground">
                      {usage.used} / {usage.limit} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="xs"
                    render={
                      <Link href={`/admin/users/${sub.sellerId}`}>
                        <Eye size={12} className="mr-1" />
                        Account
                      </Link>
                    }
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="xs"
                    render={
                      <Link href={`/admin/listings?search=${encodeURIComponent(sub.sellerName)}`}>
                        <Storefront size={12} className="mr-1" />
                        Listings
                      </Link>
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            )
          })
        ) : (
          <DataTableEmpty
            colSpan={1}
            title="No subscribers found"
            description="Try adjusting your search criteria or active filters."
          />
        )}
      </div>

      <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
