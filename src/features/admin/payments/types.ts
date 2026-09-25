export type PaymentStatus = "successful" | "pending" | "failed"

export type PaymentPurpose = "promotion" | "subscription"

export interface AdminPaymentTransaction {
  id: string
  transactionReference: string
  payerId: string
  payerName: string
  payerPhone: string
  payerEmail: string
  amount: number
  currency: string
  purpose: PaymentPurpose
  purposeTitle: string
  relatedId?: string
  paymentMethod: "ABA KHQR"
  status: PaymentStatus
  createdAt: string
  paidAt?: string
  notes?: string
}
