"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"

import {
  Receipt,
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
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
  const t = useTranslations("ui.account")
  if (!payment) return null

  const canContinuePayment = payment.status === "pending" && Boolean(payment.checkoutUrl)

  const statusConfig = {
    paid: {
      label: t("paymentPaid"),
      icon: CheckCircle,
      className: "bg-primary/10 text-primary border-primary/20",
    },
    pending: {
      label: t("paymentPending"),
      icon: Clock,
      className: "bg-accent/10 text-accent border-accent/20",
    },
    failed: {
      label: t("paymentFailed"),
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    expired: {
      label: t("paymentExpired"),
      icon: Clock,
      className: "bg-muted text-muted-foreground border-border",
    },
    cancelled: {
      label: t("paymentCancelled"),
      icon: XCircle,
      className: "bg-muted text-muted-foreground border-border",
    },
    refunded: {
      label: t("paymentRefunded"),
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
            <LocalizedText id="paymentDetails" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium"><LocalizedText id="status" /></span>
              <Badge
                variant="outline"
                className={`gap-1 font-bold text-xxs ${statusConfig.className}`}
              >
                <StatusIcon size={13} weight="fill" />
                <span>{statusConfig.label}</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium"><LocalizedText id="amount" /></span>
              <span className="text-base font-black text-foreground">
                ${payment.amount.toFixed(2)} {payment.currency}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium"><LocalizedText id="date" /></span>
              <span className="font-bold text-foreground">
                {payment.createdAt
                  ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(payment.createdAt))
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium"><LocalizedText id="paymentMethod" /></span>
              <span className="font-bold text-foreground">{payment.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium"><LocalizedText id="transactionId" /></span>
              <span className="font-mono text-foreground font-bold">{payment.transactionId}</span>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-card border border-border/80">
            <span className="text-muted-foreground block text-xxs font-semibold mb-1">
              <LocalizedText id="description_9b6f3f" />
            </span>
            <p className="font-bold text-foreground">{payment.description}</p>
          </div>
        </div>

        <DialogFooter className={canContinuePayment ? "mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2" : "mt-2"}>
          {canContinuePayment && payment.checkoutUrl && (
            <a
              href={payment.checkoutUrl}
              className={buttonVariants({ className: "h-10 w-full min-w-0 text-xs font-semibold" })}
            >
              <LocalizedText id="continuePayment" />
            </a>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs font-semibold h-10"
          >
            <LocalizedText id="close" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
