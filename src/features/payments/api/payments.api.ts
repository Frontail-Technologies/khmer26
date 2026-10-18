import { apiClient } from "@/lib/api/client"

export type CheckoutIntent =
  | { purpose: "subscription"; planId: string }
  | { purpose: "promotion"; listingId: string; packageId: string }

export type CheckoutStatus = "pending" | "successful" | "failed" | "expired" | "cancelled"

export interface CheckoutPayment {
  id: string
  referenceCode: string
  purpose: "subscription" | "promotion"
  description: string | null
  amount: number
  currency: string
  status: CheckoutStatus
  expiresAt: string | null
  paidAt: string | null
  qrUrl: string | null
  qrString: string | null
  deeplink: string | null
  checkoutUrl: string | null
  needsReview: boolean
}

interface BackendCheckout extends Omit<CheckoutPayment, "amount" | "needsReview"> {
  amount: string | number
  needsReview?: boolean
}

function normalize(payment: BackendCheckout): CheckoutPayment {
  return { ...payment, amount: Number(payment.amount), needsReview: payment.needsReview ?? false }
}

export const TERMINAL_STATUSES: readonly CheckoutStatus[] = ["successful", "failed", "expired", "cancelled"]

export async function createCheckout(intent: CheckoutIntent): Promise<CheckoutPayment> {
  const response = await apiClient.post<BackendCheckout>("/payments/checkout", intent)
  return normalize(response.data)
}

export async function getCheckoutPayment(id: string): Promise<CheckoutPayment> {
  const response = await apiClient.get<BackendCheckout>(`/payments/${id}`)
  return normalize(response.data)
}
