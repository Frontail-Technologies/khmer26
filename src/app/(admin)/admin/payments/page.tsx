import type { Metadata } from "next"
import { PaymentTable } from "@/features/admin/payments/components/payment-table"

export const metadata: Metadata = {
  title: "Payments",
  description: "Review subscription and promotion payments.",
}

export default function AdminPaymentsPage() {
  return <PaymentTable />
}
