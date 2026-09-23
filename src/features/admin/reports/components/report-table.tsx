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
import { ReportToolbar } from "./report-toolbar"
import { ReportMobileCards } from "./report-mobile-cards"
import { reportColumns } from "../columns"
import type { AdminReport } from "../types"

interface ReportTableProps {
  initialData: AdminReport[]
}

export function ReportTable({ initialData }: ReportTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [targetTypeFilter, setTargetTypeFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [reasonFilter, setReasonFilter] = useState("")
  const [mobileSort, setMobileSort] = useState("newest")

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false
      if (targetTypeFilter && item.targetType !== targetTypeFilter) return false
      if (priorityFilter && item.priority !== priorityFilter) return false
      if (reasonFilter && item.reason !== reasonFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesId = item.id.toLowerCase().includes(q)
        const matchesTitle = item.target.title.toLowerCase().includes(q)
        const matchesTargetId = item.target.id.toLowerCase().includes(q)
        const matchesReason = item.reasonLabel.toLowerCase().includes(q)
        const matchesStatement = item.statement.toLowerCase().includes(q)
        const matchesReporter = item.reporter.name.toLowerCase().includes(q)

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesTargetId &&
          !matchesReason &&
          !matchesStatement &&
          !matchesReporter
        ) {
          return false
        }
      }

      return true
    })
  }, [
    initialData,
    searchQuery,
    statusFilter,
    targetTypeFilter,
    priorityFilter,
    reasonFilter,
  ])

  const table = useReactTable({
    data: filteredData,
    columns: reportColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleMobileSortChange = (val: string) => {
    setMobileSort(val)
    if (val === "newest") {
      setSorting([{ id: "timestamp", desc: true }])
    } else if (val === "oldest") {
      setSorting([{ id: "timestamp", desc: false }])
    } else if (val === "priority") {
      setSorting([{ id: "priority", desc: false }])
    } else if (val === "status") {
      setSorting([{ id: "status", desc: false }])
    }
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
      statusFilter ||
      targetTypeFilter ||
      priorityFilter ||
      reasonFilter
  )

  const handleReset = () => {
    setSearchQuery("")
    setStatusFilter("")
    setTargetTypeFilter("")
    setPriorityFilter("")
    setReasonFilter("")
  }

  return (
    <div className="space-y-3.5">
      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        targetTypeFilter={targetTypeFilter}
        onTargetTypeChange={setTargetTypeFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        reasonFilter={reasonFilter}
        onReasonChange={setReasonFilter}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialData.length}
        filteredCount={filteredData.length}
      />

      <div className="hidden md:block rounded-xl bg-card overflow-hidden shadow-2xs">
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
                    onClick={() => router.push(`/admin/reports/${row.original.id}`)}
                    className="transition-colors hover:bg-muted/30 border-b border-border/60 cursor-pointer"
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
                  colSpan={reportColumns.length}
                  title="No safety reports found"
                  description="Try adjusting your search terms or active moderation filters."
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="block md:hidden">
        <ReportMobileCards
          data={filteredData}
          sortBy={mobileSort}
          onSortChange={handleMobileSortChange}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
