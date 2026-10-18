import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import { createCheckout, getCheckoutPayment } from "./payments.api"

vi.mock("@/lib/api/client", () => ({ apiClient: { get: vi.fn(), post: vi.fn() } }))
const get = vi.mocked(apiClient.get)
const post = vi.mocked(apiClient.post)

const backendPayment = {
  id: "pay-1",
  referenceCode: "PAY_ABC",
  purpose: "subscription",
  description: "Seller Plus subscription",
  amount: "9.99",
  currency: "USD",
  status: "pending",
  expiresAt: "2026-10-16T10:03:00.000Z",
  paidAt: null,
  qrUrl: "https://pay.test/qr.svg",
  qrString: "000201",
  deeplink: "abamobilebank://x",
  checkoutUrl: "https://pay.test/checkout/1",
}

describe("payments API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("starts a checkout with the intent only and returns a numeric amount", async () => {
    post.mockResolvedValueOnce({ success: true, data: backendPayment })

    const payment = await createCheckout({ purpose: "subscription", planId: "plan-1" })

    expect(post).toHaveBeenCalledWith("/payments/checkout", { purpose: "subscription", planId: "plan-1" })
    expect(payment.amount).toBe(9.99)
    expect(payment.needsReview).toBe(false)
  })

  it("loads one payment by id", async () => {
    get.mockResolvedValueOnce({ success: true, data: { ...backendPayment, status: "successful", needsReview: true } })

    const payment = await getCheckoutPayment("pay-1")

    expect(get).toHaveBeenCalledWith("/payments/pay-1")
    expect(payment).toMatchObject({ status: "successful", needsReview: true })
  })
})
