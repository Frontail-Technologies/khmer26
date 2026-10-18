import { beforeEach, describe, expect, it, vi } from "vitest"
import { getPublicSafetyTips } from "./content.api"

describe("public content API", () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it("requests safety tips for the selected marketplace context", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => ({
        success: true,
        data: { tips: [{ id: "tip-1", tip: "Meet in public", context: "listing_detail", sortOrder: 1 }] },
      }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const tips = await getPublicSafetyTips("listing_detail")

    expect(tips).toHaveLength(1)
    expect(String(fetchMock.mock.calls[0]![0])).toContain("/content/safety-tips?context=listing_detail")
  })
})
