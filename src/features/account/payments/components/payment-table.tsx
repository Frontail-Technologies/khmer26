"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Receipt,
  CheckCircle,
  Clock,
  XCircle,
  ArrowCounterClockwise,
} from "@phosphor-icons/react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters/currency"
import type { AccountPaymentRecord, PaymentStatus } from "../../types"

interface PaymentTableProps {
  payments: AccountPaymentRecord[]
  onSelectPayment: (payment: AccountPaymentRecord) => void
}

function getPaymentStatusConfig(status: PaymentStatus): {
  label: string
  tone: StatusTone
  icon: typeof CheckCircle
} {
  switch (status) {
    case "paid":
      return { label: "Paid", tone: "success", icon: CheckCircle }
    case "pending":
      return { label: "Pending", tone: "warning", icon: Clock }
    case "failed":
      return { label: "Failed", tone: "destructive", icon: XCircle }
    case "refunded":
      return { label: "Refunded", tone: "neutral", icon: ArrowCounterClockwise }
    default:
      return { label: status, tone: "neutral", icon: Clock }
  }
}

function getTypeLabel(type: AccountPaymentRecord["type"]): string {
  switch (type) {
    case "featured_listing":
      return "Featured Listing"
    case "top_listing":
      return "Top Listing"
    case "subscription":
      return "Subscription"
    case "promotion":
      return "Promotion"
    default:
      return type
  }
}

export function PaymentTable({ payments, onSelectPayment }: PaymentTableProps) {
  const columns = useMemo<ColumnDef<AccountPaymentRecord>[]>(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {row.original.date}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-bold text-foreground max-w-55 truncate block">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {getTypeLabel(row.original.type)}
          </span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Method",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.paymentMethod}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-black text-foreground whitespace-nowrap">
            {formatCurrency(row.original.amount, row.original.currency)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const cfg = getPaymentStatusConfig(row.original.status)
          const StatusIcon = cfg.icon
          return (
            <StatusBadge
              label={cfg.label}
              tone={cfg.tone}
              icon={<StatusIcon size={13} weight="fill" />}
            />
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Receipt</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelectPayment(row.original)
              }}
              className="h-8 px-2.5 text-xs text-primary font-semibold gap-1"
            >
              <Receipt size={14} />
              <span>View</span>
            </Button>
          </div>
        ),
      },
    ],
    [onSelectPayment]
  )

  return (
    <>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={payments}
          pageSize={10}
          onRowClick={onSelectPayment}
          emptyTitle="No payment records"
          emptyDescription="You don't have any billing or payment transactions yet."
        />
      </div>

      <div className="md:hidden space-y-3">
        {payments.length > 0 ? (
          payments.map((payment) => {
            const cfg = getPaymentStatusConfig(payment.status)
            const StatusIcon = cfg.icon

            return (
              <Card
                key={payment.id}
                onClick={() => onSelectPayment(payment)}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2.5 cursor-pointer active:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">
                      {payment.date}
                    </span>
                    <h4 className="font-bold text-xs text-foreground mt-0.5">
                      {payment.description}
                    </h4>
                  </div>

                  <span className="text-sm font-black text-foreground shrink-0">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground text-[11px]">
                    {payment.paymentMethod}
                  </span>
                  <StatusBadge
                    label={cfg.label}
                    tone={cfg.tone}
                    icon={<StatusIcon size={13} weight="fill" />}
                    size="sm"
                  />
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="rounded-xl border border-border/80 bg-card p-8 text-center">
            <p className="text-xs font-bold text-foreground">No payments found</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              You don&apos;t have any payment transactions yet.
            </p>
          </Card>
        )}
      </div>
    </>
  )
}
