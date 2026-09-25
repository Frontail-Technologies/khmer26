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
import { MagnifyingGlass, Eye } from "@phosphor-icons/react"
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
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { createNotificationColumns } from "../columns"
import { NotificationDetailSheet } from "./notification-detail-sheet"
import type { NotificationRecord } from "../types"

interface NotificationHistoryTableProps {
  initialRecords: NotificationRecord[]
}

const AUDIENCE_LABELS: Record<string, string> = {
  all_users: "All Users",
  buyers: "Buyers",
  sellers: "Sellers",
  dealers: "Businesses & Dealers",
  specific_user: "Specific User",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  sent: { label: "Sent", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "destructive" },
}

export function NotificationHistoryTable({
  initialRecords,
}: NotificationHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sentAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<NotificationRecord | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = (record: NotificationRecord) => {
    setSelectedRecord(record)
    setSheetOpen(true)
  }

  const columns = useMemo(() => {
    return createNotificationColumns({ onViewDetails: handleViewDetails })
  }, [])

  const filteredData = useMemo(() => {
    return initialRecords.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [initialRecords, searchQuery])

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

  return (
    <>
      <div className="p-3 sm:p-4 border-b border-border/60">
        <div className="relative max-w-sm">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search sent notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
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
                title="No notification records found"
                description="Try adjusting your search criteria."
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
                    <span className="font-semibold text-xs text-foreground block truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {item.message}
                    </span>
                  </div>
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {AUDIENCE_LABELS[item.audience] || item.audience}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {item.sentAt}
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
                    View Details
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <DataTableEmpty
            colSpan={1}
            title="No notification records found"
            description="Try adjusting your search criteria."
          />
        )}
      </div>

      <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
        <DataTablePagination table={table} />
      </div>

      <NotificationDetailSheet
        notification={selectedRecord}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
