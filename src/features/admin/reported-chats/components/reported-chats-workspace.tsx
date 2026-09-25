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
import { createReportedChatColumns } from "../columns"
import { ReportedChatDetailSheet } from "./reported-chat-detail-sheet"
import type { ReportedChatRecord, ReportedChatStatus } from "../types"
import { cn } from "@/lib/utils"

interface ReportedChatsWorkspaceProps {
  initialReports: ReportedChatRecord[]
}

const REASON_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Violation Reasons" },
  { value: "Suspicious payment request", label: "Suspicious Payment" },
  { value: "Spam / Commercial advertising", label: "Spam / Advertising" },
  { value: "Inappropriate language / Harassment", label: "Harassment" },
]

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  open: { label: "Open", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
}

type TabStatusKey = "all" | "open" | "resolved" | "dismissed"

export function ReportedChatsWorkspace({
  initialReports,
}: ReportedChatsWorkspaceProps) {
  const [reports, setReports] = useState<ReportedChatRecord[]>(initialReports)
  const [activeTab, setActiveTab] = useState<TabStatusKey>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [reasonFilter, setReasonFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<ReportedChatRecord | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = (record: ReportedChatRecord) => {
    setSelectedReport(record)
    setSheetOpen(true)
  }

  const handleStatusChange = (id: string, newStatus: ReportedChatStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  const columns = useMemo(() => {
    return createReportedChatColumns({ onViewDetails: handleViewDetails })
  }, [])

  const counts = useMemo(() => {
    return {
      all: reports.length,
      open: reports.filter((r) => r.status === "open").length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      dismissed: reports.filter((r) => r.status === "dismissed").length,
    }
  }, [reports])

  const filteredData = useMemo(() => {
    return reports.filter((item) => {
      if (activeTab !== "all" && item.status !== activeTab) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesUser =
          item.reportedUserName.toLowerCase().includes(q) ||
          item.reporterName.toLowerCase().includes(q) ||
          item.participantA.name.toLowerCase().includes(q) ||
          item.participantB.name.toLowerCase().includes(q)
        const matchesId = item.id.toLowerCase().includes(q)
        const matchesReason = item.reason.toLowerCase().includes(q)
        const matchesMessage = item.reportedMessageText.toLowerCase().includes(q)
        if (!matchesUser && !matchesId && !matchesReason && !matchesMessage) {
          return false
        }
      }

      if (reasonFilter !== "all" && item.reason !== reasonFilter) {
        return false
      }

      return true
    })
  }, [reports, activeTab, searchQuery, reasonFilter])

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

  const hasActiveFilters = Boolean(searchQuery) || reasonFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setReasonFilter("all")
  }

  const tabs: { key: TabStatusKey; label: string; count: number; warning?: boolean }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "open", label: "Open", count: counts.open, warning: counts.open > 0 },
    { key: "resolved", label: "Resolved", count: counts.resolved },
    { key: "dismissed", label: "Dismissed", count: counts.dismissed },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
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
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <MagnifyingGlass
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search reported conversations, users, reasons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Select
              value={reasonFilter}
              items={REASON_OPTIONS}
              onValueChange={(val) => setReasonFilter(val ?? "all")}
            >
              <SelectTrigger className="h-9 text-xs w-[170px] shrink-0">
                <SelectValue placeholder="All Violation Reasons">
                  {(val) => getSelectOptionLabel(REASON_OPTIONS, val, "All Violation Reasons")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REASON_OPTIONS.map((opt) => (
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
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
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
                    className="transition-colors hover:bg-muted/25 border-b border-border/60 h-14 cursor-pointer"
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
                  title="No reported chats found"
                  description="Try adjusting your search criteria or active tab."
                />
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y divide-border/60">
          {filteredData.length ? (
            filteredData.map((item) => {
              const statusConf = STATUS_CONFIG[item.status] || {
                label: item.status,
                tone: "neutral" as StatusTone,
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleViewDetails(item)}
                  className="p-3.5 space-y-2.5 hover:bg-muted/25 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground truncate">
                        <span>{item.participantA.name}</span>
                        <span className="text-muted-foreground font-normal">↔</span>
                        <span>{item.participantB.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block truncate">
                        &quot;{item.reportedMessageText}&quot;
                      </span>
                    </div>
                    <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Badge variant="outline" className="text-[10px] font-medium border-destructive/30 text-destructive bg-destructive/5">
                      {item.reason}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {item.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-end pt-1 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleViewDetails(item)}
                      className="text-xs"
                    >
                      <Eye size={12} className="mr-1" />
                      Review Report
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <DataTableEmpty
              colSpan={1}
              title="No reported chats found"
              description="Try adjusting your search criteria or active tab."
            />
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
          <DataTablePagination table={table} />
        </div>
      </div>

      <ReportedChatDetailSheet
        report={selectedReport}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
