import type { Metadata } from "next"
import { PaymentTable } from "@/features/admin/payments/components/payment-table"
import { DEMO_ADMIN_PAYMENTS } from "@/features/admin/payments/data/demo-payment-data"

export const metadata: Metadata = {
  title: "Payments",
  description: "Review subscription and promotion payments.",
}

export default function AdminPaymentsPage() {
  return (
    <PaymentTable
      initialPayments={DEMO_ADMIN_PAYMENTS}
    />
  )
}
