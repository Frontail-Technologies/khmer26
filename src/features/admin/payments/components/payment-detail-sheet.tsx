"use client"

import Link from "next/link"
import {
  Receipt,
  User,
  ArrowSquareOut,
  Info,
  QrCode,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminPaymentTransaction } from "../types"

interface PaymentDetailSheetProps {
  transaction: AdminPaymentTransaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  successful: { label: "Successful", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "destructive" },
}

export function PaymentDetailSheet({
  transaction,
  open,
  onOpenChange,
}: PaymentDetailSheetProps) {
  if (!transaction) return null

  const conf = STATUS_CONFIG[transaction.status] || {
    label: transaction.status,
    tone: "neutral" as StatusTone,
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[440px] p-4 space-y-4 overflow-y-auto text-xs">
        <SheetHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <Receipt size={16} />
              <span>Payment Details</span>
            </div>
            <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground block pt-1">
            {transaction.id}
          </span>
        </SheetHeader>

        <div className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="text-xl font-bold text-foreground">
              ${transaction.amount.toLocaleString()} {transaction.currency}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-muted-foreground">Payment Purpose</span>
            <Badge variant="outline" className="text-[10px] uppercase font-bold">
              {transaction.purpose}
            </Badge>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Purpose Details</span>
            <span className="font-semibold text-foreground block">{transaction.purposeTitle}</span>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <QrCode size={13} />
              Payment Method & Reference
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground">{transaction.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ABA KHQR Reference</span>
                <span className="font-mono font-semibold text-foreground">
                  {transaction.transactionReference}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Initiated Date</span>
                <span className="text-foreground">{transaction.createdAt}</span>
              </div>
              {transaction.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Paid At</span>
                  <span className="text-foreground font-medium">{transaction.paidAt}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} />
              Payer Account
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{transaction.payerName}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{transaction.payerId}</span>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-0.5">
                <span className="block truncate">Phone: {transaction.payerPhone}</span>
                <span className="block truncate">Email: {transaction.payerEmail}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border/40">
              <Button
                variant="outline"
                size="xs"
                className="w-full text-xs"
                render={
                  <Link href={`/admin/users/${transaction.payerId}`}>
                    <ArrowSquareOut size={12} className="mr-1" />
                    Open User Profile
                  </Link>
                }
              />
            </div>
          </div>

          {transaction.notes && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
              <Info size={15} className="shrink-0 mt-0.5 text-muted-foreground" />
              <p className="leading-relaxed text-[11px]">{transaction.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
