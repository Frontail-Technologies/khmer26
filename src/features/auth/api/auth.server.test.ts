import { afterEach, describe, expect, it, vi } from "vitest"
import { getServerCurrentUser } from "./auth.server"

describe("getServerCurrentUser", () => {
  afterEach(() => vi.restoreAllMocks())

  it("forwards request cookies and returns the authenticated user", async () => {
    const user = {
      id: "user-1",
      email: "seller@example.com",
      role: "user" as const,
      status: "active",
      emailVerifiedAt: null,
      createdAt: "2026-10-16T00:00:00.000Z",
    }
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { user } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    )

    await expect(getServerCurrentUser("k26_access_dev=access-token")).resolves.toEqual(user)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/me$/),
      expect.objectContaining({
        cache: "no-store",
        headers: expect.objectContaining({ Cookie: "k26_access_dev=access-token" }),
      })
    )
  })

  it("does not turn an expired access token into a cached guest", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 401 }))
    await expect(getServerCurrentUser("k26_session_dev=refresh-token")).rejects.toThrow(
      "Server authentication lookup failed with 401"
    )
  })
})
