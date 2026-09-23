"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, QrCode, CreditCard, DeviceMobile } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminPaymentTransaction } from "./types"

const GATEWAY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  bakong: { label: "Bakong KHQR", icon: <QrCode size={13} className="text-red-500" /> },
  aba: { label: "ABA PayWay", icon: <DeviceMobile size={13} className="text-blue-500" /> },
  acleda: { label: "ACLEDA Bank", icon: <CreditCard size={13} className="text-amber-500" /> },
  wing: { label: "Wing Bank", icon: <DeviceMobile size={13} className="text-emerald-500" /> },
  card: { label: "Visa / Master", icon: <CreditCard size={13} className="text-indigo-500" /> },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  successful: { label: "Successful", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "destructive" },
  refunded: { label: "Refunded", tone: "neutral" },
}

interface PaymentColumnOptions {
  onViewDetails: (tx: AdminPaymentTransaction) => void
}

export function createPaymentColumns({ onViewDetails }: PaymentColumnOptions): ColumnDef<AdminPaymentTransaction>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction" />
      ),
      cell: ({ row }) => {
        const tx = row.original
        return (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-xs text-foreground block">{tx.id}</span>
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
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-mono">{tx.payerId}</span>
              <span>•</span>
              <span className="truncate">{tx.payerPhone}</span>
            </div>
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
                className="text-[9px] uppercase font-bold px-1 py-0 h-4"
              >
                {tx.purpose}
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground block truncate">{tx.purposeTitle}</span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "gateway",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gateway" />
      ),
      cell: ({ row }) => {
        const gw = GATEWAY_LABELS[row.original.gateway] || { label: row.original.gateway, icon: null }
        return (
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            {gw.icon}
            <span className="text-xs">{gw.label}</span>
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
        const conf = STATUS_CONFIG[row.original.status] || { label: row.original.status, tone: "neutral" as StatusTone }
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
        <span className="text-xs text-muted-foreground">{row.original.createdAt}</span>
      ),
      sortingFn: "datetime",
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
            aria-label="View receipt"
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}
