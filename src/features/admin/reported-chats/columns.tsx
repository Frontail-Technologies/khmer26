"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye, WarningCircle } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { ReportedChatRecord } from "./types"

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  open: { label: "Open", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
}

interface ReportedChatColumnOptions {
  onViewDetails: (record: ReportedChatRecord) => void
}

export function createReportedChatColumns({
  onViewDetails,
}: ReportedChatColumnOptions): ColumnDef<ReportedChatRecord>[] {
  return [
    {
      accessorKey: "conversationId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Conversation" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5 min-w-[220px]">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
              <span>{item.participantA.name}</span>
              <span className="text-muted-foreground font-normal">↔</span>
              <span>{item.participantB.name}</span>
            </div>
            {item.listing && (
              <span className="text-[11px] text-primary block truncate">
                {item.listing.title}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground block truncate max-w-sm">
              &quot;{item.reportedMessageText}&quot;
            </span>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "reportedUserName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reported User" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5 min-w-[140px]">
            <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
              <WarningCircle size={13} className="text-destructive shrink-0" weight="fill" />
              <span className="truncate">{item.reportedUserName}</span>
            </div>
            <span className="text-[10px] text-muted-foreground capitalize block">
              {item.reportedUserAccountType}
            </span>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "reason",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reason" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-medium border-destructive/30 text-destructive bg-destructive/5">
          {row.original.reason}
        </Badge>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "reporterName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reporter" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground block truncate">
          {row.original.reporterName}
        </span>
      ),
      sortingFn: "alphanumeric",
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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reported At" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.createdAt}
        </span>
      ),
      sortingFn: "datetime",
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
            aria-label="View reported chat details"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}
