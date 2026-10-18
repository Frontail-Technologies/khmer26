"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { Receipt } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { AccountPageHeader } from "../../components/account-page-header"
import type { AccountPaymentRecord } from "../../types"
import { useAccountPayments } from "../api/payments.queries"
import { PaymentDetailsDialog } from "./payment-details-dialog"
import { PaymentSummary } from "./payment-summary"
import { PaymentTable } from "./payment-table"

export function AccountPaymentsView() {
  const tGenerated = useTranslations("generated")
  const tAccount = useTranslations("ui.account")
  const tDynamic = useTranslations("dynamic")
  const [selectedPayment, setSelectedPayment] = useState<AccountPaymentRecord | null>(null)
  const query = useAccountPayments(1, 100)
  const payments = query.data?.items ?? []

  return (
    <div className="space-y-6">
      <AccountPageHeader title={tGenerated("paymentsReceipts")} />
      {query.isLoading ? (
        <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div><Skeleton className="h-72" /></div>
      ) : query.isError ? (
        <div className="rounded-lg border bg-card p-8 text-center"><h2 className="font-bold"><LocalizedText id="paymentHistoryCouldNotBeLoaded" /></h2><p className="mt-1 text-sm text-muted-foreground">{query.error instanceof Error ? query.error.message : tGenerated("pleaseTryAgain")}</p><Button variant="outline" className="mt-4" onClick={() => query.refetch()}><LocalizedText id="tryAgain" /></Button></div>
      ) : (
        <div className="space-y-6">
          <PaymentSummary payments={payments} summary={query.data?.summary ?? { totalPaid: 0, primaryMethod: null }} />
          <section className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-base font-bold"><LocalizedText id="transactionHistory" /></h2><span className="text-xs font-semibold text-muted-foreground">{tDynamic("transactionCount", { count: query.data?.pagination.total ?? 0 })}</span></div>
            {payments.length > 0 ? (
              <PaymentTable payments={payments} onSelectPayment={setSelectedPayment} />
            ) : (
              <div className="rounded-lg border border-dashed bg-card/40 p-8"><EmptyState icon={<Receipt size={32} className="text-muted-foreground" />} title={tGenerated("noPaymentHistory")} description={tAccount("noPaymentsYetDescription")} /></div>
            )}
          </section>
        </div>
      )}
      <PaymentDetailsDialog payment={selectedPayment} open={Boolean(selectedPayment)} onOpenChange={(open) => !open && setSelectedPayment(null)} />
    </div>
  )
}
