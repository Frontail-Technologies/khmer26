"use client"

import { actionColumnClass } from "@/components/data-table/pinned-actions"
import { cn } from "@/lib/utils"

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
import type { SelectOption } from "@/components/ui/select"
import { AdminFilterBar, AdminFilterSelect } from "@/components/admin/admin-filter-bar"
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
  seller_plus: { label: "Seller Plus", badgeClass: "bg-primary/10 text-primary border-primary/20" },
  business: { label: "Business Pro", badgeClass: "bg-accent/10 text-accent border-accent/20" },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
  paused: { label: "Paused", tone: "warning" },
}

export function SubscriberTable({ initialSubscribers }: SubscriberTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "expiresAt", desc: true },
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

  const activeFilterCount = [planFilter, statusFilter].filter((value) => value !== "all").length

  const handleReset = () => {
    setSearchQuery("")
    setPlanFilter("all")
    setStatusFilter("all")
  }

  return (
    <>
      <AdminFilterBar
        search={{ value: searchQuery, onChange: setSearchQuery, placeholder: "Search subscribers" }}
        activeCount={activeFilterCount}
        onReset={handleReset}
      >
        <AdminFilterSelect label="Plan" value={planFilter} onChange={setPlanFilter} options={PLAN_OPTIONS} widthClassName="w-36" />
        <AdminFilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} widthClassName="w-36" />
      </AdminFilterBar>

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
                    className={cn("py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80", actionColumnClass(header.column.id, "head"))}
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
                    <TableCell key={cell.id} className={cn("py-3 px-4 text-xs", actionColumnClass(cell.column.id))}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <DataTableEmpty
                colSpan={subscriberColumns.length}
                title="No subscribers found"
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
                    <span className="text-2xs text-muted-foreground block">
                      {sub.planName}
                    </span>
                  </div>
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Badge
                    variant="outline"
                    className={`text-2xs font-semibold px-2 py-0.5 h-5 ${planConfig.badgeClass}`}
                  >
                    {planConfig.label}
                  </Badge>
                  <span className="text-xxs text-muted-foreground">
                    Expires: {sub.expiresAt}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xxs">
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
            title="No subscribers found"
          />
        )}
      </div>

      <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
