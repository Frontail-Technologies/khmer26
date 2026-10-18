"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

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

type Translate = ReturnType<typeof useTranslations<"ui.account">>

function getPaymentStatusConfig(status: PaymentStatus, t: Translate): {
  label: string
  tone: StatusTone
  icon: typeof CheckCircle
} {
  switch (status) {
    case "paid":
      return { label: t("paymentPaid"), tone: "success", icon: CheckCircle }
    case "pending":
      return { label: t("paymentPending"), tone: "warning", icon: Clock }
    case "failed":
      return { label: t("paymentFailed"), tone: "destructive", icon: XCircle }
    case "expired":
      return { label: t("paymentExpired"), tone: "neutral", icon: Clock }
    case "cancelled":
      return { label: t("paymentCancelled"), tone: "neutral", icon: XCircle }
    case "refunded":
      return { label: t("paymentRefunded"), tone: "neutral", icon: ArrowCounterClockwise }
    default:
      return { label: status, tone: "neutral", icon: Clock }
  }
}

function getTypeLabel(type: AccountPaymentRecord["type"], t: Translate): string {
  switch (type) {
    case "featured_listing":
      return t("typeFeatured")
    case "top_listing":
      return t("typeTop")
    case "subscription":
      return t("typeSubscription")
    case "promotion":
      return t("typePromotion")
    default:
      return type
  }
}

export function PaymentTable({ payments, onSelectPayment }: PaymentTableProps) {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.account")
  const columns = useMemo<ColumnDef<AccountPaymentRecord>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tGenerated("date")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {row.original.createdAt
              ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(row.original.createdAt))
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tGenerated("description")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-bold text-foreground max-w-55 truncate block">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: t("columnType"),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {getTypeLabel(row.original.type, t)}
          </span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: t("columnMethod"),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.paymentMethod}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tGenerated("amount")} />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-black text-foreground whitespace-nowrap">
            {formatCurrency(row.original.amount, row.original.currency)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: t("columnStatus"),
        cell: ({ row }) => {
          const cfg = getPaymentStatusConfig(row.original.status, t)
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
        header: () => <div className="text-right"><LocalizedText id="receipt" /></div>,
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
              <span><LocalizedText id="view" /></span>
            </Button>
          </div>
        ),
      },
    ],
    [onSelectPayment, tGenerated, t]
  )

  return (
    <>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={payments}
          pageSize={10}
          onRowClick={onSelectPayment}
          emptyTitle={t("noPaymentRecords")}
          emptyDescription={t("noPaymentRecordsDescription")}
        />
      </div>

      <div className="md:hidden space-y-3">
        {payments.length > 0 ? (
          payments.map((payment) => {
            const cfg = getPaymentStatusConfig(payment.status, t)
            const StatusIcon = cfg.icon

            return (
              <Card
                key={payment.id}
                onClick={() => onSelectPayment(payment)}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2.5 cursor-pointer active:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xxs text-muted-foreground block">
                      {payment.createdAt
                        ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(payment.createdAt))
                        : "—"}
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
                  <span className="text-muted-foreground text-xxs">
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
            <p className="text-xs font-bold text-foreground"><LocalizedText id="noPaymentsFound" /></p>
            <p className="text-xxs text-muted-foreground mt-1">
              <LocalizedText id="youDonTHaveAnyPaymentTransactionsYet" />
            </p>
          </Card>
        )}
      </div>
    </>
  )
}
