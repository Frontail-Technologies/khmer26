import { describe, expect, it } from "vitest"
import { isAdminHostname, normalizeHostname } from "./admin-host"

describe("admin hostname helpers", () => {
  it("normalizes forwarded hosts and ports", () => {
    expect(normalizeHostname("admin.localhost:3000, proxy.internal")).toBe(
      "admin.localhost"
    )
  })

  it("recognizes local and production admin subdomains", () => {
    expect(isAdminHostname("admin.localhost")).toBe(true)
    expect(isAdminHostname("admin.khmer26.com")).toBe(true)
    expect(isAdminHostname("khmer26.com")).toBe(false)
  })
})
