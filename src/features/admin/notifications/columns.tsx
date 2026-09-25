"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { NotificationRecord } from "./types"

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

interface NotificationColumnOptions {
  onViewDetails: (record: NotificationRecord) => void
}

export function createNotificationColumns({
  onViewDetails,
}: NotificationColumnOptions): ColumnDef<NotificationRecord>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notification" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5 min-w-[240px]">
            <span className="font-semibold text-xs text-foreground block truncate">
              {item.title}
            </span>
            <span className="text-[11px] text-muted-foreground block truncate max-w-md">
              {item.message}
            </span>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "audience",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Audience" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-medium">
          {AUDIENCE_LABELS[row.original.audience] || row.original.audience}
        </Badge>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "sentAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sent At" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.sentAt}
        </span>
      ),
      sortingFn: "datetime",
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const conf = STATUS_CONFIG[row.original.status] || {
          label: row.original.status,
          tone: "neutral" as StatusTone,
        }
        return <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
      },
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onViewDetails(row.original)}
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="View notification details"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}
