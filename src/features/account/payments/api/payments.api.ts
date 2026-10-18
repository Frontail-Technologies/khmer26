import { apiClient } from "@/lib/api/client"
import { toPage, type Page } from "@/lib/api/pagination"
import type { AccountPaymentRecord } from "../../types"

interface BackendPayment {
  id: string
  referenceCode: string
  purpose: "subscription" | "promotion"
  description: string
  amount: string | number
  currency: string
  paymentMethod: "aba_khqr" | "cambopay"
  status: "pending" | "successful" | "failed" | "expired" | "cancelled"
  createdAt: string
  paidAt: string | null
  checkoutUrl: string | null
}

const METHOD_LABELS: Record<BackendPayment["paymentMethod"], string> = { aba_khqr: "ABA KHQR", cambopay: "KHQR" }

function normalizePayment(payment: BackendPayment): AccountPaymentRecord {
  return {
    id: payment.id,
    transactionId: payment.referenceCode,
    createdAt: payment.createdAt,
    paidAt: payment.paidAt ?? undefined,
    description: payment.description,
    type: payment.purpose,
    amount: Number(payment.amount),
    currency: payment.currency,
    paymentMethod: METHOD_LABELS[payment.paymentMethod] ?? payment.paymentMethod,
    status: payment.status === "successful" ? "paid" : payment.status,
    checkoutUrl: payment.checkoutUrl ?? undefined,
  }
}

export interface AccountPaymentsPage extends Page<AccountPaymentRecord> {
  summary: { totalPaid: number; primaryMethod: string | null }
}

export async function getAccountPayments(page = 1, limit = 20): Promise<AccountPaymentsPage> {
  const response = await apiClient.get<BackendPayment[]>("/users/me/payments", { params: { page, limit } })
  const rawSummary = response.meta?.summary as { totalPaid?: unknown; primaryMethod?: unknown } | undefined
  return {
    ...toPage(response, { page, limit }),
    items: response.data.map(normalizePayment),
    summary: {
      totalPaid: Number(rawSummary?.totalPaid ?? 0),
      primaryMethod: typeof rawSummary?.primaryMethod === "string" ? METHOD_LABELS[rawSummary.primaryMethod as BackendPayment["paymentMethod"]] ?? null : null,
    },
  }
}
