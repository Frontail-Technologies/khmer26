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
  MagnifyingGlass,
  ArrowCounterClockwise,
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
import { createAuditColumns } from "../columns"
import { AuditDetailSheet } from "./audit-detail-sheet"
import type { AdminAuditEntry, AuditModule } from "../types"

interface AuditTableProps {
  initialEntries: AdminAuditEntry[]
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

export function AuditTable({ initialEntries }: AuditTableProps) {
  const [entries] = useState<AdminAuditEntry[]>(initialEntries)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [selectedEntry, setSelectedEntry] = useState<AdminAuditEntry | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = useCallback((entry: AdminAuditEntry) => {
    setSelectedEntry(entry)
    setSheetOpen(true)
  }, [])

  const filteredData = useMemo(() => {
    return entries.filter((item) => {
      if (moduleFilter !== "all" && item.module !== moduleFilter) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesAction = item.action.toLowerCase().includes(q)
        const matchesActor = item.actorName.toLowerCase().includes(q)
        const matchesTarget = item.targetName.toLowerCase().includes(q)
        const matchesTargetId = item.targetId.toLowerCase().includes(q)
        const matchesId = item.id.toLowerCase().includes(q)

        if (
          !matchesAction &&
          !matchesActor &&
          !matchesTarget &&
          !matchesTargetId &&
          !matchesId
        ) {
          return false
        }
      }

      return true
    })
  }, [entries, moduleFilter, searchQuery])

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

  const hasActiveFilters = Boolean(searchQuery) || moduleFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setModuleFilter("all")
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search audit log by admin, action, or target entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Select
              value={moduleFilter}
              items={MODULE_OPTIONS}
              onValueChange={(val) => setModuleFilter(val ?? "all")}
            >
              <SelectTrigger className="h-9 text-xs w-[140px] shrink-0">
                <SelectValue placeholder="All Modules">
                  {(val) => getSelectOptionLabel(MODULE_OPTIONS, val, "All Modules")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {MODULE_OPTIONS.map((opt) => (
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
                  description="Try adjusting your search criteria or active module filter."
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
                    <span className="text-[10px] text-muted-foreground block">
                      {entry.actorRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 h-5">
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

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="truncate pr-2">{entry.targetName}</span>
                  <span className="text-[10px] whitespace-nowrap shrink-0">{entry.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <DataTableEmpty
              colSpan={1}
              title="No audit events found"
              description="Try adjusting your search criteria or active module filter."
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
