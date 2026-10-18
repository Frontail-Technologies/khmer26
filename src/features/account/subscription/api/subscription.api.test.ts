import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import { getSubscriptionHistory, getSubscriptionPlans, getSubscriptionUsage } from "./subscription.api"

vi.mock("@/lib/api/client", () => ({ apiClient: { get: vi.fn() } }))
const get = vi.mocked(apiClient.get)

describe("account subscription API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("uses the public plan and authenticated account endpoints", async () => {
    get
      .mockResolvedValueOnce({ success: true, data: { plans: [{ id: "plan-1" }] } })
      .mockResolvedValueOnce({ success: true, data: { plan: { id: "free" }, activeListings: 0 } })
      .mockResolvedValueOnce({ success: true, data: { subscriptions: [{ id: "sub-1" }] } })

    await expect(getSubscriptionPlans()).resolves.toEqual([{ id: "plan-1" }])
    await expect(getSubscriptionUsage()).resolves.toMatchObject({ activeListings: 0 })
    await expect(getSubscriptionHistory()).resolves.toEqual([{ id: "sub-1" }])
    expect(get.mock.calls.map(([url]) => url)).toEqual([
      "/subscription-plans",
      "/users/me/subscription-usage",
      "/users/me/subscriptions",
    ])
  })
})
