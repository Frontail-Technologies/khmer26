import { describe, expect, it, vi, beforeEach } from "vitest"
import { buildListingsQuery, searchListings } from "../api/listings.api"

function mockFetch(payload: Record<string, unknown>) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    json: async () => ({ success: true, ...payload }),
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

describe("search API query construction", () => {
  it("uses the exact backend parameter names", () => {
    expect(
      buildListingsQuery(
        {
          q: "prius",
          category: "cars",
          provinceId: 1,
          districtId: 2,
          communeId: 3,
          minPrice: 10,
          maxPrice: 20,
          currency: "USD",
          sort: "price_desc",
          fields: { transmission: "automatic" },
        },
        2,
        12
      )
    ).toEqual({
      page: 2,
      limit: 12,
      sort: "price_desc",
      q: "prius",
      categoryId: "cars",
      provinceId: 1,
      districtId: 2,
      communeId: 3,
      minPrice: 10,
      maxPrice: 20,
      currency: "USD",
      "fields[transmission]": "automatic",
    })
  })

  it("omits unset filters and never sends dynamic fields without a category", () => {
    expect(buildListingsQuery({ sort: "newest", fields: { year: "2020" } }, 1, 12)).toEqual({
      page: 1,
      limit: 12,
      sort: "newest",
    })
  })
})

describe("searchListings", () => {
  beforeEach(() => vi.unstubAllGlobals())

  it("sends the backend query string and reads pagination from meta", async () => {
    const fetchMock = mockFetch({
      data: [{ id: "1" }],
      meta: { page: 2, limit: 12, total: 30, totalPages: 3 },
    })

    const result = await searchListings(
      { category: "cars", sort: "newest", fields: { year: "2020" } },
      2
    )

    const url = decodeURIComponent(String(fetchMock.mock.calls[0][0]))
    expect(url).toContain("/listings?")
    expect(url).toContain("categoryId=cars")
    expect(url).toContain("page=2")
    expect(url).toContain("limit=12")
    expect(url).toContain("fields[year]=2020")
    expect(result.items).toEqual([{ id: "1" }])
    expect(result.pagination).toEqual({ page: 2, limit: 12, total: 30, totalPages: 3 })
  })

  it("returns an empty page for zero results", async () => {
    mockFetch({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })
    const result = await searchListings({ sort: "newest" }, 1)
    expect(result.items).toEqual([])
    expect(result.pagination.total).toBe(0)
  })
})
