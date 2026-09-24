"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { Card } from "@/components/ui/card"
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
import { ReportToolbar } from "./report-toolbar"
import { ReportMobileCards } from "./report-mobile-cards"
import { reportColumns } from "../columns"
import type { AdminReport } from "../types"
import { cn } from "@/lib/utils"

interface ReportTableProps {
  initialData: AdminReport[]
}

type ReportTabKey = "all" | "open" | "resolved" | "dismissed"

export function ReportTable({ initialData }: ReportTableProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ReportTabKey>("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [targetTypeFilter, setTargetTypeFilter] = useState("")
  const [reasonFilter, setReasonFilter] = useState("")

  const counts = useMemo(() => {
    return {
      all: initialData.length,
      open: initialData.filter((i) => i.status === "open" || i.status === "in_review").length,
      resolved: initialData.filter((i) => i.status === "resolved").length,
      dismissed: initialData.filter((i) => i.status === "dismissed").length,
    }
  }, [initialData])

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      if (activeTab === "open" && item.status !== "open" && item.status !== "in_review") {
        return false
      }
      if (activeTab === "resolved" && item.status !== "resolved") {
        return false
      }
      if (activeTab === "dismissed" && item.status !== "dismissed") {
        return false
      }

      if (statusFilter && item.status !== statusFilter) return false
      if (targetTypeFilter && item.targetType !== targetTypeFilter) return false
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
    activeTab,
    searchQuery,
    statusFilter,
    targetTypeFilter,
    reasonFilter,
  ])

  const table = useReactTable({
    data: filteredData,
    columns: reportColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const hasActiveFilters = Boolean(
    searchQuery ||
      statusFilter ||
      targetTypeFilter ||
      reasonFilter
  )

  const handleReset = () => {
    setSearchQuery("")
    setStatusFilter("")
    setTargetTypeFilter("")
    setReasonFilter("")
  }

  const tabs: { key: ReportTabKey; label: string; count?: number; warning?: boolean }[] = [
    { key: "all", label: "All Reports", count: counts.all },
    { key: "open", label: "Open", count: counts.open, warning: counts.open > 0 },
    { key: "resolved", label: "Resolved", count: counts.resolved },
    { key: "dismissed", label: "Dismissed", count: counts.dismissed },
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
                onClick={() => setActiveTab(tab.key)}
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
                      tab.warning
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

      <ReportToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        targetTypeFilter={targetTypeFilter}
        onTargetTypeChange={setTargetTypeFilter}
        reasonFilter={reasonFilter}
        onReasonChange={setReasonFilter}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialData.length}
        filteredCount={filteredData.length}
      />

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
                    onClick={() => router.push(`/admin/reports/${row.original.id}`)}
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
                  colSpan={reportColumns.length}
                  title="No reports found"
                  description="Try adjusting your search terms, status tabs, or active filters."
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="block md:hidden p-3.5">
        <ReportMobileCards data={filteredData} />
      </div>

      <div className="border-t border-border/60 bg-muted/10 p-2 sm:p-3">
        <DataTablePagination table={table} />
      </div>
    </Card>
  )
}
