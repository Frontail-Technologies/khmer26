"use client"

import {
  Receipt,
  DownloadSimple,
  CheckCircle,
  Clock,
  XCircle,
  ArrowCounterClockwise,
} from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AccountPaymentRecord } from "../../types"

interface PaymentDetailsDialogProps {
  payment: AccountPaymentRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDetailsDialog({
  payment,
  open,
  onOpenChange,
}: PaymentDetailsDialogProps) {
  if (!payment) return null

  const statusConfig = {
    paid: {
      label: "Paid",
      icon: CheckCircle,
      className: "bg-primary/10 text-primary border-primary/20",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    refunded: {
      label: "Refunded",
      icon: ArrowCounterClockwise,
      className: "bg-muted text-muted-foreground border-border",
    },
  }[payment.status] || {
    label: payment.status,
    icon: CheckCircle,
    className: "bg-muted text-muted-foreground border-border",
  }

  const StatusIcon = statusConfig.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <Receipt size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Payment Details
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Official transaction receipt for marketplace services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Status</span>
              <Badge
                variant="outline"
                className={`gap-1 font-bold text-[11px] ${statusConfig.className}`}
              >
                <StatusIcon size={13} weight="fill" />
                <span>{statusConfig.label}</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Amount</span>
              <span className="text-base font-black text-foreground">
                ${payment.amount.toFixed(2)} {payment.currency}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Date</span>
              <span className="font-bold text-foreground">{payment.date}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Payment Method</span>
              <span className="font-bold text-foreground">{payment.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Transaction ID</span>
              <span className="font-mono text-foreground font-bold">{payment.transactionId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Invoice Number</span>
              <span className="font-mono text-foreground">{payment.invoiceNumber}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/80">
            <span className="text-muted-foreground block text-[11px] font-semibold mb-1">
              Description:
            </span>
            <p className="font-bold text-foreground">{payment.description}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 text-xs font-semibold h-10"
          >
            Close
          </Button>
          <Button
            type="button"
            className="w-full sm:flex-1 text-xs font-semibold h-10 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            onClick={() => onOpenChange(false)}
          >
            <DownloadSimple size={16} />
            <span>Download Receipt</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
