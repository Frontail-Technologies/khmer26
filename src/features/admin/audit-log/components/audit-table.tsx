"use client"

import { useState, useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table"
import {
  Eye,
} from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SelectOption } from "@/components/ui/select"
import { AdminFilterBar, AdminFilterField, AdminFilterSelect } from "@/components/admin/admin-filter-bar"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { createAuditColumns } from "../columns"
import { AuditDetailSheet } from "./audit-detail-sheet"
import { useAdminAuditLogs } from "../hooks/audit-log.queries"
import type { AdminAuditEntry, AuditModule } from "../types"

interface AuditTableProps {
  initialEntries?: AdminAuditEntry[]
}

const MODULE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Modules" },
  { value: "listings", label: "Listings" },
  { value: "users", label: "Users" },
  { value: "payments", label: "Payments" },
  { value: "content", label: "Content" },
  { value: "settings", label: "Settings" },
  { value: "roles", label: "Roles" },
  { value: "reports", label: "Reports" },
  { value: "verifications", label: "Verifications" },
]

const MODULE_LABELS: Record<AuditModule, string> = {
  listings: "Listings",
  verifications: "Verifications",
  reports: "Reports",
  users: "Users",
  payments: "Payments",
  content: "Content",
  settings: "Settings",
  roles: "Roles",
}

export function AuditTable({ initialEntries = [] }: AuditTableProps) {
  const { data } = useAdminAuditLogs()
  const entries = data?.items ?? initialEntries
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<AdminAuditEntry | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = useCallback((entry: AdminAuditEntry) => {
    setSelectedEntry(entry)
    setSheetOpen(true)
  }, [])

  const filteredData = useMemo(() => {
    const fromMs = dateFrom ? new Date(dateFrom).getTime() : null
    const toMs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null

    return entries.filter((item) => {
      if (moduleFilter !== "all" && item.module !== moduleFilter) return false

      if (actionFilter.trim()) {
        if (!item.action.toLowerCase().includes(actionFilter.toLowerCase().trim())) return false
      }

      if (fromMs !== null || toMs !== null) {
        const itemMs = item.rawTimestamp ? new Date(item.rawTimestamp).getTime() : null
        if (itemMs === null) return false
        if (fromMs !== null && itemMs < fromMs) return false
        if (toMs !== null && itemMs > toMs) return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesAction = item.action.toLowerCase().includes(q)
        const matchesActor = item.actorName.toLowerCase().includes(q)
        const matchesTarget = item.targetName.toLowerCase().includes(q)
        const matchesReference = item.displayId.toLowerCase().includes(q)
        if (!matchesAction && !matchesActor && !matchesTarget && !matchesReference) return false
      }

      return true
    })
  }, [entries, moduleFilter, actionFilter, dateFrom, dateTo, searchQuery])

  const columns = useMemo(() => {
    return createAuditColumns({ onViewDetails: handleViewDetails })
  }, [handleViewDetails])

  const table = useReactTable({
    data: filteredData,
    columns,
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

  const activeFilterCount = [moduleFilter !== "all", Boolean(actionFilter), Boolean(dateFrom), Boolean(dateTo)].filter(Boolean).length

  const handleReset = () => {
    setSearchQuery("")
    setModuleFilter("all")
    setActionFilter("")
    setDateFrom("")
    setDateTo("")
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <AdminFilterBar
          search={{ value: searchQuery, onChange: setSearchQuery, placeholder: "Search audit log" }}
          activeCount={activeFilterCount}
          onReset={handleReset}
        >
          <AdminFilterSelect label="Module" value={moduleFilter} onChange={setModuleFilter} options={MODULE_OPTIONS} widthClassName="w-36" />
          <AdminFilterField label="Action">
            <input
              type="text"
              placeholder="Filter by action"
              aria-label="Filter by action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9 w-36 rounded-full border border-input bg-transparent px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-primary/15"
            />
          </AdminFilterField>
          <AdminFilterField label="Date range">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 w-36 rounded-full border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-3 focus:ring-primary/15"
              aria-label="Date from"
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 w-36 rounded-full border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-3 focus:ring-primary/15"
              aria-label="Date to"
            />
          </AdminFilterField>
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
                    onClick={() => handleViewDetails(row.original)}
                    className="hover:bg-muted/40 transition-colors border-b border-border/50 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4 text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableEmpty
                  colSpan={columns.length}
                  title="No audit events found"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y divide-border/60">
          {filteredData.length ? (
            filteredData.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleViewDetails(entry)}
                className="p-3.5 space-y-2 hover:bg-muted/20 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-semibold text-xs text-foreground block">
                      {entry.actorName}
                    </span>
                    <span className="text-2xs text-muted-foreground block">
                      {entry.actorRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-2xs font-medium px-2 py-0.5 h-5">
                      {MODULE_LABELS[entry.module] || entry.module}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(entry)
                      }}
                      className="size-7 text-muted-foreground hover:text-foreground"
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {entry.action}
                </p>

                <div className="flex items-center justify-between text-xxs text-muted-foreground pt-1 border-t border-border/40">
                  <span className="truncate pr-2">{entry.targetName}</span>
                  <span className="text-2xs whitespace-nowrap shrink-0">{entry.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <DataTableEmpty
              title="No audit events found"
            />
          )}
        </div>

        <div className="border-t border-border/60">
          <DataTablePagination table={table} />
        </div>
      </div>

      <AuditDetailSheet
        entry={selectedEntry}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
