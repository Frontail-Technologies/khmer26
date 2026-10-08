import { describe, expect, it, vi, beforeEach } from "vitest"
import { getHome } from "../api/home.api"
import { makeHome, makeListing } from "./fixtures"

describe("getHome", () => {
  beforeEach(() => vi.unstubAllGlobals())

  it("calls GET /home and returns the backend DTO unchanged", async () => {
    const dto = makeHome({ newListings: [makeListing()] })
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({ success: true, data: dto }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const result = await getHome()

    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/home$/)
    expect(fetchMock.mock.calls[0][1].method).toBe("GET")
    expect(result).toEqual(dto)
  })
})
