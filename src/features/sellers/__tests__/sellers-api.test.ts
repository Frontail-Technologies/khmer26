import { beforeEach, describe, expect, it, vi } from "vitest"

const get = vi.fn()
const post = vi.fn()
vi.mock("@/lib/api/client", () => ({
  apiClient: { get: (...a: unknown[]) => get(...a), post: (...a: unknown[]) => post(...a) },
}))

import {
  createReview,
  getSeller,
  getSellerListingsPage,
  getSellerReportReasons,
  getSellerReviewsPage,
  reportSeller,
} from "../api/sellers.api"
import { marketplaceKeys } from "@/lib/query/keys"
import { makeSeller } from "./seller-fixtures"

beforeEach(() => {
  get.mockReset()
  post.mockReset()
})

describe("sellers API contract", () => {
  it("reads the seller from data.profile", async () => {
    const profile = makeSeller()
    get.mockResolvedValue({ data: { profile } })
    await expect(getSeller("abc")).resolves.toEqual(profile)
    expect(get).toHaveBeenCalledWith("/sellers/abc")
  })

  it("reads listing pages from data + meta pagination", async () => {
    get.mockResolvedValue({
      data: [{ id: "l1" }],
      meta: { page: 2, limit: 12, total: 13, totalPages: 2 },
    })
    const page = await getSellerListingsPage("s1", { page: 2, limit: 12 })
    expect(get).toHaveBeenCalledWith("/sellers/s1/listings", { params: { page: 2, limit: 12 } })
    expect(page.items).toHaveLength(1)
    expect(page.pagination.total).toBe(13)
  })

  it("reads review pages from data + meta pagination", async () => {
    get.mockResolvedValue({
      data: [{ id: "r1" }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    })
    const page = await getSellerReviewsPage("s1", { page: 1, limit: 10 })
    expect(get).toHaveBeenCalledWith("/sellers/s1/reviews", { params: { page: 1, limit: 10 } })
    expect(page.pagination.totalPages).toBe(1)
  })

  it("posts a review with the seller profile id, rating and comment", async () => {
    post.mockResolvedValue({ data: {} })
    await createReview({ sellerProfileId: "s1", rating: 4, comment: "Nice" })
    expect(post).toHaveBeenCalledWith("/reviews", { sellerProfileId: "s1", rating: 4, comment: "Nice" })
  })

  it("loads seller report reasons and posts the report payload", async () => {
    get.mockResolvedValue({ data: { reasons: [{ id: "r1", label: "Spam", description: null }] } })
    await expect(getSellerReportReasons()).resolves.toEqual([{ id: "r1", label: "Spam", description: null }])
    expect(get).toHaveBeenCalledWith("/reports/reasons", { params: { targetType: "seller" } })

    post.mockResolvedValue({ data: {} })
    await reportSeller("s1", { reasonId: "r1", details: "scam" })
    expect(post).toHaveBeenCalledWith("/reports/sellers/s1", { reasonId: "r1", details: "scam" })
  })
})

describe("seller query keys", () => {
  it("are hierarchical under marketplace.sellers", () => {
    expect(marketplaceKeys.sellers.detail("s1")).toEqual(["marketplace", "sellers", "detail", "s1"])
    expect(marketplaceKeys.sellers.listings("s1", { limit: 12 })).toEqual([
      "marketplace",
      "sellers",
      "listings",
      "s1",
      { limit: 12 },
    ])
    expect(marketplaceKeys.sellers.reviews("s1", { limit: 10 })).toEqual([
      "marketplace",
      "sellers",
      "reviews",
      "s1",
      { limit: 10 },
    ])
  })
})
