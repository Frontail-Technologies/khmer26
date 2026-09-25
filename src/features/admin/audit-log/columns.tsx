"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AdminAuditEntry, AuditModule } from "./types"

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

interface AuditColumnOptions {
  onViewDetails: (entry: AdminAuditEntry) => void
}

export function createAuditColumns({
  onViewDetails,
}: AuditColumnOptions): ColumnDef<AdminAuditEntry>[] {
  return [
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.timestamp}
        </span>
      ),
      sortingFn: "datetime",
    },
    {
      accessorKey: "actorName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Admin Staff" />
      ),
      cell: ({ row }) => {
        const entry = row.original
        return (
          <div className="space-y-0.5 min-w-[130px]">
            <span className="font-semibold text-xs text-foreground block">
              {entry.actorName}
            </span>
            <span className="text-[10px] text-muted-foreground block">
              {entry.actorRole}
            </span>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-xs text-foreground block min-w-[200px] max-w-[320px]">
          {row.original.action}
        </span>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "module",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Module" />
      ),
      cell: ({ row }) => {
        const mod = row.original.module
        return (
          <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 h-5">
            {MODULE_LABELS[mod] || mod}
          </Badge>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "targetName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Target Entity" />
      ),
      cell: ({ row }) => {
        const entry = row.original
        return (
          <div className="space-y-0.5 min-w-[160px] max-w-[240px]">
            <span className="font-medium text-xs text-foreground block truncate">
              {entry.targetName}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>{entry.targetType}</span>
              <span>•</span>
              <span className="font-mono">{entry.targetId}</span>
            </div>
          </div>
        )
      },
      enableSorting: false,
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
            aria-label="Inspect audit log details"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}
