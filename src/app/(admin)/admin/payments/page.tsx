import type { Metadata } from "next"
import { PaymentTable } from "@/features/admin/payments/components/payment-table"
import {
  DEMO_PAYMENT_STATS,
  DEMO_ADMIN_PAYMENTS,
} from "@/features/admin/payments/data/demo-payment-data"

export const metadata: Metadata = {
  title: "Payments & Invoices",
  description: "Review marketplace transactions, payment gateways, and settlements.",
}

export default function AdminPaymentsPage() {
  return (
    <PaymentTable
      stats={DEMO_PAYMENT_STATS}
      initialPayments={DEMO_ADMIN_PAYMENTS}
    />
  )
}
