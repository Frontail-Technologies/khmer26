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
import { createAuditColumns } from "../columns"
import { AuditSummaryMetrics } from "./audit-summary-metrics"
import { AuditToolbar } from "./audit-toolbar"
import { AuditDetailSheet } from "./audit-detail-sheet"
import type { AdminAuditEntry, AuditLogStats } from "../types"

interface AuditTableProps {
  stats: AuditLogStats
  initialEntries: AdminAuditEntry[]
}

export function AuditTable({ stats, initialEntries }: AuditTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [actorFilter, setActorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEntry, setSelectedEntry] = useState<AdminAuditEntry | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = (entry: AdminAuditEntry) => {
    setSelectedEntry(entry)
    setSheetOpen(true)
  }

  const columns = useMemo(() => {
    return createAuditColumns({ onViewDetails: handleViewDetails })
  }, [])

  const filteredData = useMemo(() => {
    return initialEntries.filter((entry) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesAction = entry.action.toLowerCase().includes(q)
        const matchesTarget = entry.targetName.toLowerCase().includes(q)
        const matchesTargetId = entry.targetId.toLowerCase().includes(q)
        const matchesActor = entry.actorName.toLowerCase().includes(q)
        const matchesIp = entry.ipAddress.toLowerCase().includes(q)
        const matchesId = entry.id.toLowerCase().includes(q)
        if (
          !matchesAction &&
          !matchesTarget &&
          !matchesTargetId &&
          !matchesActor &&
          !matchesIp &&
          !matchesId
        ) {
          return false
        }
      }

      if (moduleFilter !== "all" && entry.module !== moduleFilter) {
        return false
      }

      if (actorFilter !== "all" && entry.actorName !== actorFilter) {
        return false
      }

      if (statusFilter !== "all" && entry.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [initialEntries, searchQuery, moduleFilter, actorFilter, statusFilter])

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

  const hasActiveFilters =
    Boolean(searchQuery) ||
    moduleFilter !== "all" ||
    actorFilter !== "all" ||
    statusFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setModuleFilter("all")
    setActorFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <AuditSummaryMetrics stats={stats} />

      <div className="rounded-xl bg-card overflow-hidden shadow-2xs">
        <AuditToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          moduleFilter={moduleFilter}
          onModuleChange={setModuleFilter}
          actorFilter={actorFilter}
          onActorChange={setActorFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={handleReset}
          hasActiveFilters={hasActiveFilters}
        />

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
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleViewDetails(row.original)}
                    className="transition-colors hover:bg-muted/25 border-b border-border/60 cursor-pointer h-14"
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
                  colSpan={columns.length}
                  title="No audit entries found"
                  description="Try adjusting your audit trail search query or filters."
                />
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
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
