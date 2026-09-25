"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminPaymentTransaction } from "./types"

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  successful: { label: "Successful", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "destructive" },
}

interface PaymentColumnOptions {
  onViewDetails: (tx: AdminPaymentTransaction) => void
}

export function createPaymentColumns({
  onViewDetails,
}: PaymentColumnOptions): ColumnDef<AdminPaymentTransaction>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment" />
      ),
      cell: ({ row }) => {
        const tx = row.original
        return (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-xs text-foreground block">
              {tx.id}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground block truncate">
              {tx.transactionReference}
            </span>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "payerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payer" />
      ),
      cell: ({ row }) => {
        const tx = row.original
        return (
          <div className="space-y-0.5 min-w-[150px]">
            <Link
              href={`/admin/users/${tx.payerId}`}
              className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {tx.payerName}
            </Link>
            <span className="font-mono text-[10px] text-muted-foreground block">
              {tx.payerId}
            </span>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "purpose",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Purpose" />
      ),
      cell: ({ row }) => {
        const tx = row.original
        return (
          <div className="space-y-0.5 max-w-[220px]">
            <div className="flex items-center gap-1.5">
              <Badge
                variant={tx.purpose === "subscription" ? "default" : "secondary"}
                className="text-[9px] uppercase font-bold px-1.5 py-0 h-4"
              >
                {tx.purpose}
              </Badge>
              <span className="text-xs font-medium text-foreground truncate">
                {tx.purposeTitle}
              </span>
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-xs text-foreground">
          ${row.original.amount.toLocaleString()} {row.original.currency}
        </span>
      ),
      sortingFn: "basic",
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
        <DataTableColumnHeader column={column} title="Date" />
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
            aria-label="View payment details"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}
