"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminAuditEntry } from "./types"

const MODULE_LABELS: Record<string, string> = {
  listings: "Listings",
  verifications: "Verifications",
  reports: "Reports",
  users: "Users",
  payments: "Payments",
  content: "Content",
  settings: "Settings",
  roles: "Roles & Access",
  auth: "Security Auth",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  success: { label: "Success", tone: "success" },
  warning: { label: "Warning", tone: "warning" },
  failure: { label: "Failed", tone: "destructive" },
}

interface AuditColumnOptions {
  onViewDetails: (entry: AdminAuditEntry) => void
}

export function createAuditColumns({ onViewDetails }: AuditColumnOptions): ColumnDef<AdminAuditEntry>[] {
  return [
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Timestamp" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
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
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-foreground block">{entry.actorName}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-mono block">
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
        <DataTableColumnHeader column={column} title="Action Taken" />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-xs text-foreground block">
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
          <Badge variant="outline" className="text-[10px] font-medium">
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
          <div className="space-y-0.5 min-w-[160px] max-w-[220px]">
            <span className="font-medium text-xs text-foreground block truncate">
              {entry.targetName}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground block">
              {entry.targetType}: {entry.targetId}
            </span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Result" />
      ),
      cell: ({ row }) => {
        const conf = STATUS_CONFIG[row.original.status] || { label: row.original.status, tone: "neutral" as StatusTone }
        return <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
      },
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(row.original)
            }}
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="Inspect metadata"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}
