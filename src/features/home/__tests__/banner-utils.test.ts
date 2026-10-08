import { describe, expect, it } from "vitest"
import { resolveBannerDestination } from "../lib/banner-utils"

describe("resolveBannerDestination", () => {
  it("resolves only safe, valid destinations", () => {
    expect(resolveBannerDestination("no_action", "x")).toBeNull()
    expect(resolveBannerDestination("category", "cars")).toBe("/category/cars")
    expect(resolveBannerDestination("url", "/pricing")).toBe("/pricing")
    expect(resolveBannerDestination("url", "https://example.com/a")).toBe("https://example.com/a")
    expect(resolveBannerDestination("url", "//evil.com")).toBeNull()
    expect(resolveBannerDestination("url", "javascript:alert(1)")).toBeNull()
  })
})
