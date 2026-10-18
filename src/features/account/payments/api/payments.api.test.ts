import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import { getAccountPayments } from "./payments.api"

vi.mock("@/lib/api/client", () => ({ apiClient: { get: vi.fn() } }))
const get = vi.mocked(apiClient.get)

describe("account payments API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("loads owned payments and normalizes backend values", async () => {
    get.mockResolvedValueOnce({
      success: true,
      data: [{
        id: "payment-1",
        referenceCode: "SUB_123",
        purpose: "subscription",
        description: "Seller Plus",
        amount: "12.50",
        currency: "USD",
        paymentMethod: "aba_khqr",
        status: "successful",
        createdAt: "2026-10-15T10:00:00.000Z",
        paidAt: "2026-10-15T10:01:00.000Z",
        checkoutUrl: "https://pay.test/checkout/1",
      }],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1, summary: { totalPaid: 12.5, primaryMethod: "aba_khqr" } },
    })
    const result = await getAccountPayments(1, 20)
    expect(get).toHaveBeenCalledWith("/users/me/payments", { params: { page: 1, limit: 20 } })
    expect(result.items[0]).toMatchObject({
      transactionId: "SUB_123",
      amount: 12.5,
      paymentMethod: "ABA KHQR",
      status: "paid",
      checkoutUrl: "https://pay.test/checkout/1",
    })
    expect(result.pagination.total).toBe(1)
    expect(result.summary).toEqual({ totalPaid: 12.5, primaryMethod: "ABA KHQR" })
  })
})
