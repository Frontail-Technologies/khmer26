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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"
import { createNotificationColumns } from "../columns"
import { NotificationDetailSheet } from "./notification-detail-sheet"
import { useUpdateBroadcast, useDeleteBroadcast } from "../hooks/notifications.mutations"
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
  const [editingRecord, setEditingRecord] = useState<NotificationRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NotificationRecord | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editMessage, setEditMessage] = useState("")
  const updateBroadcast = useUpdateBroadcast()
  const deleteBroadcast = useDeleteBroadcast()

  const handleViewDetails = (record: NotificationRecord) => {
    setSelectedRecord(record)
    setSheetOpen(true)
  }

  const handleOpenEdit = (record: NotificationRecord) => {
    setEditingRecord(record)
    setEditTitle(record.title)
    setEditMessage(record.message)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRecord) return
    updateBroadcast.mutate(
      { id: editingRecord.id, data: { title: editTitle.trim(), body: editMessage.trim() } },
      { onSuccess: () => setEditingRecord(null) }
    )
  }

  const columns = useMemo(() => {
    return createNotificationColumns({
      onViewDetails: handleViewDetails,
      onEdit: handleOpenEdit,
      onDelete: setDeleteTarget,
    })
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

      <Dialog open={Boolean(editingRecord)} onOpenChange={(open) => { if (!open) setEditingRecord(null) }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold">Edit Broadcast</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update the title or body of this sent broadcast record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 p-4 sm:p-5">
            <Field>
              <FieldLabel required>Title</FieldLabel>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </Field>
            <Field>
              <FieldLabel required>Message</FieldLabel>
              <Textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={4}
                className="text-xs resize-none"
                required
              />
            </Field>
            <DialogFooter className="pt-4 border-t border-border/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingRecord(null)} className="text-xs cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!editTitle.trim() || !editMessage.trim() || updateBroadcast.isPending} className="text-xs font-semibold cursor-pointer">
                {updateBroadcast.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete broadcast?"
        description={`This will permanently remove "${deleteTarget?.title ?? "this broadcast"}" from the history.`}
        confirmLabel="Delete Broadcast"
        variant="destructive"
        isPending={deleteBroadcast.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteBroadcast.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
      />
    </>
  )
}
