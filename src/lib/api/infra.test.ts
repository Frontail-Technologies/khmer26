import { afterEach, describe, expect, it, vi } from "vitest"
import { customerKeys, marketplaceKeys } from "@/lib/query/keys"
import { getApiBaseUrl } from "./base-url"
import { toPage } from "./pagination"

describe("getApiBaseUrl", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("uses NEXT_PUBLIC_API_URL when configured", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3002/api/v1")
    expect(getApiBaseUrl()).toBe("http://localhost:3002/api/v1")
  })

  it("otherwise follows the page's own host on the default API port", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "")
    expect(getApiBaseUrl()).toBe(`${window.location.protocol}//${window.location.hostname}:3001/api/v1`)
  })
})

describe("toPage", () => {
  const params = { page: 2, limit: 10 }

  it("reads pagination from meta (the backend's list envelope)", () => {
    const page = toPage({ data: ["a"], meta: { page: 2, limit: 10, total: 21, totalPages: 3 } }, params)
    expect(page).toEqual({ items: ["a"], pagination: { page: 2, limit: 10, total: 21, totalPages: 3 } })
  })

  it("ignores extra meta fields such as counts", () => {
    const page = toPage({ data: [1], meta: { page: 1, limit: 20, total: 5, totalPages: 1, counts: { active: 3 } } }, { page: 1, limit: 20 })
    expect(page.pagination).toEqual({ page: 1, limit: 20, total: 5, totalPages: 1 })
  })

  it("falls back to the legacy `pagination` key, then to a single complete page", () => {
    expect(toPage({ data: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } }, params).pagination.total).toBe(0)
    expect(toPage({ data: ["x", "y"] }, params).pagination).toEqual({ page: 2, limit: 10, total: 2, totalPages: 1 })
  })
})

describe("customer query keys", () => {
  it("are hierarchical, so one prefix invalidates a whole area", () => {
    const list = customerKeys.myListings.list({ status: "active" })
    expect(list.slice(0, customerKeys.myListings.all.length)).toEqual([...customerKeys.myListings.all])
    expect(customerKeys.conversations.detail("c1").slice(0, 2)).toEqual([...customerKeys.conversations.all])
    expect(customerKeys.notifications.unread().slice(0, 2)).toEqual([...customerKeys.notifications.all])
  })

  it("never collide with each other or with the marketplace namespace", () => {
    const roots = [
      customerKeys.myListings.all,
      customerKeys.favorites.all,
      customerKeys.conversations.all,
      customerKeys.messages.all,
      customerKeys.notifications.all,
      customerKeys.subscription.all,
    ].map((k) => k.join("/"))
    expect(new Set(roots).size).toBe(roots.length)
    expect(roots.every((r) => !r.startsWith(marketplaceKeys.all[0]))).toBe(true)
  })

  it("separates keys by their parameters", () => {
    expect(customerKeys.favorites.list({ page: 1 })).not.toEqual(customerKeys.favorites.list({ page: 2 }))
    expect(customerKeys.messages.thread("a")).not.toEqual(customerKeys.messages.thread("b"))
  })
})
