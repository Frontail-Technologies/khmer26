import { describe, expect, it, vi, beforeEach } from "vitest"
import {
  addFavorite,
  createOffer,
  getListing,
  getReportReasons,
  getSimilarListings,
  removeFavorite,
  reportListing,
  startConversation,
} from "../api/listing-detail.api"
import { makeDetail } from "./detail-fixtures"

function mockFetch(data: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    headers: { get: () => "application/json" },
    json: async () => ({ success: status < 400, data }),
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

const urlOf = (fetchMock: ReturnType<typeof vi.fn>) => decodeURIComponent(String(fetchMock.mock.calls[0][0]))
const initOf = (fetchMock: ReturnType<typeof vi.fn>) => fetchMock.mock.calls[0][1] as RequestInit

describe("listing detail API contract", () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    sessionStorage.setItem("k26_csrf", "test-token")
  })

  it("GET /listings/:id returns the backend DTO unchanged", async () => {
    const detail = makeDetail()
    const fetchMock = mockFetch({ listing: detail })

    expect(await getListing(detail.id)).toEqual(detail)
    expect(urlOf(fetchMock)).toMatch(new RegExp(`/listings/${detail.id}$`))
    expect(initOf(fetchMock).method).toBe("GET")
  })

  it("surfaces a 404 as an ApiError with the status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => "application/json" },
        json: async () => ({ success: false, error: { code: "NOT_FOUND", message: "Listing not found" } }),
      })
    )
    await expect(getListing("x")).rejects.toMatchObject({ status: 404 })
  })

  it("GET /listings/:id/similar unwraps { listings } with a limit", async () => {
    const fetchMock = mockFetch({ listings: [{ id: "a" }] })
    expect(await getSimilarListings("abc", 8)).toEqual([{ id: "a" }])
    expect(urlOf(fetchMock)).toContain("/listings/abc/similar?limit=8")
  })

  it("adds and removes favorites with POST and DELETE on the listing", async () => {
    const add = mockFetch({ favorited: true })
    await addFavorite("L1")
    expect(urlOf(add)).toMatch(/\/listings\/L1\/favorite$/)
    expect(initOf(add).method).toBe("POST")

    const remove = mockFetch({ favorited: false })
    await removeFavorite("L1")
    expect(initOf(remove).method).toBe("DELETE")
  })

  it("loads listing report reasons from the backend", async () => {
    const reasons = [{ id: "r1", label: "Scam", description: null }]
    const fetchMock = mockFetch({ reasons })
    expect(await getReportReasons("listing")).toEqual(reasons)
    expect(urlOf(fetchMock)).toContain("/reports/reasons?targetType=listing")
  })

  it("posts the report payload (reason id + optional details) to the listing target", async () => {
    const fetchMock = mockFetch({ report: {} }, 201)
    await reportListing("L1", { reasonId: "r1", details: "looks fake" })

    expect(urlOf(fetchMock)).toMatch(/\/reports\/listings\/L1$/)
    expect(JSON.parse(String(initOf(fetchMock).body))).toEqual({ reasonId: "r1", details: "looks fake" })
  })

  it("starts a conversation for a listing, then creates an offer on it", async () => {
    const convo = mockFetch({ conversation: { id: "C1" } }, 201)
    expect(await startConversation("L1")).toEqual({ id: "C1" })
    expect(urlOf(convo)).toMatch(/\/chat\/conversations$/)
    expect(JSON.parse(String(initOf(convo).body))).toEqual({ listingId: "L1" })

    const offer = mockFetch({ offer: {} }, 201)
    await createOffer("C1", { amount: 15000, currency: "USD" })
    expect(urlOf(offer)).toMatch(/\/chat\/conversations\/C1\/offers$/)
    expect(JSON.parse(String(initOf(offer).body))).toEqual({ amount: 15000, currency: "USD" })
  })
})
