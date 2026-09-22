"use client"

import { useState } from "react"
import { CreditCard, Receipt } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/EmptyState"
import { AccountPageHeader } from "../../components/account-page-header"
import { PaymentSummary } from "./payment-summary"
import { PaymentTable } from "./payment-table"
import { PaymentDetailsDialog } from "./payment-details-dialog"
import { DEMO_PAYMENTS } from "../../data/demo-account-data"
import type { AccountPaymentRecord } from "../../types"

export function AccountPaymentsView() {
  const [payments] = useState<AccountPaymentRecord[]>(DEMO_PAYMENTS)
  const [selectedPayment, setSelectedPayment] = useState<AccountPaymentRecord | null>(null)

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Payments & Invoices"
        description="View your marketplace transaction history, receipts, and invoices."
      />

      <div className="space-y-6">
        <PaymentSummary payments={payments} />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              Transaction History
            </h3>
            <span className="text-xs text-muted-foreground font-semibold">
              {payments.length} Transactions
            </span>
          </div>

          {payments.length > 0 ? (
            <PaymentTable
              payments={payments}
              onSelectPayment={(p) => setSelectedPayment(p)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 bg-card/40">
              <EmptyState
                icon={<Receipt size={32} className="text-muted-foreground" />}
                title="No payment history"
                description="Your transaction receipts and invoices will appear here once you purchase listing promotions or memberships."
              />
            </div>
          )}
        </div>

        <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2 text-primary">
              <CreditCard size={18} weight="bold" />
              <CardTitle className="text-base font-bold text-foreground">
                Saved Payment Methods
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Direct debit cards and digital wallets saved for fast one-tap checkout.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border/70 rounded-xl bg-muted/20">
              <p className="font-semibold text-foreground">No payment methods saved</p>
              <p className="text-[11px] mt-0.5">
                Payment methods will be saved securely when you complete your next checkout.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentDetailsDialog
        payment={selectedPayment}
        open={Boolean(selectedPayment)}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
      />
    </div>
  )
}
