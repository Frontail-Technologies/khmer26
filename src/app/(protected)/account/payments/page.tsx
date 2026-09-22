import { AccountPaymentsView } from "@/features/account/payments/components/account-payments-view"

export const metadata = {
  title: "Payments",
  description: "View transaction receipts, invoices, and billing history on Khmer26",
}

export default function AccountPaymentsPage() {
  return <AccountPaymentsView />
}
