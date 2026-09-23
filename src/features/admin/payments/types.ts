export type PaymentStatus = "successful" | "pending" | "failed" | "refunded"

export type PaymentGateway = "bakong" | "aba" | "acleda" | "wing" | "card"

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
  gateway: PaymentGateway
  gatewayTxnId?: string
  status: PaymentStatus
  createdAt: string
  settledAt?: string
  receiptUrl?: string
  notes?: string
}

export interface PaymentFinancialStats {
  totalVolume: string
  totalVolumeGrowth: string
  successfulCount: number
  pendingCount: number
  failedRefundedCount: number
}
