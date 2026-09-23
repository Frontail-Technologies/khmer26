"use client"

import Link from "next/link"
import {
  Receipt,
  User,
  CreditCard,
  QrCode,
  DeviceMobile,
  ArrowSquareOut,
  Info,
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
  pending: { label: "Pending Settlement", tone: "warning" },
  failed: { label: "Failed Authorization", tone: "destructive" },
  refunded: { label: "Refunded", tone: "neutral" },
}

const GATEWAY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  bakong: { label: "Bakong KHQR (National Bank of Cambodia)", icon: <QrCode size={16} className="text-red-500" /> },
  aba: { label: "ABA PayWay Instant Mobile App", icon: <DeviceMobile size={16} className="text-blue-500" /> },
  acleda: { label: "ACLEDA Bank KHQR / Cards", icon: <CreditCard size={16} className="text-amber-500" /> },
  wing: { label: "Wing Bank Mobile Wallet", icon: <DeviceMobile size={16} className="text-emerald-500" /> },
  card: { label: "International Card (Visa / Mastercard)", icon: <CreditCard size={16} className="text-indigo-500" /> },
}

export function PaymentDetailSheet({
  transaction,
  open,
  onOpenChange,
}: PaymentDetailSheetProps) {
  if (!transaction) return null

  const conf = STATUS_CONFIG[transaction.status] || { label: transaction.status, tone: "neutral" as StatusTone }
  const gw = GATEWAY_LABELS[transaction.gateway] || { label: transaction.gateway, icon: null }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[440px] p-4 space-y-4 overflow-y-auto text-xs">
        <SheetHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <Receipt size={16} />
              <span>Transaction Receipt</span>
            </div>
            <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground block pt-1">
            {transaction.id} • Ref: {transaction.transactionReference}
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
            <span className="text-[10px] text-muted-foreground">Item / Service Details</span>
            <span className="font-semibold text-foreground block">{transaction.purposeTitle}</span>
          </div>
        </div>

        <div className="space-y-3 pt-1">
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

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard size={13} />
              Gateway & Ledger Telemetry
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Processor</span>
                <div className="flex items-center gap-1 font-medium text-foreground">
                  {gw.icon}
                  <span>{gw.label}</span>
                </div>
              </div>
              {transaction.gatewayTxnId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gateway TXN</span>
                  <span className="font-mono font-semibold text-foreground">{transaction.gatewayTxnId}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Initiated At</span>
                <span className="text-foreground">{transaction.createdAt}</span>
              </div>
              {transaction.settledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Settled At</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{transaction.settledAt}</span>
                </div>
              )}
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
