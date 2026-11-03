import { beforeEach, describe, expect, it, vi } from "vitest"
import { buildGoogleAuthUrl, consumeGoogleRedirect, startGoogleRedirect } from "../lib/google-redirect"

const assign = vi.fn()

beforeEach(() => {
  window.sessionStorage.clear()
  assign.mockReset()
  vi.spyOn(window, "location", "get").mockReturnValue({ ...window.location, origin: "https://offerupkh.com", assign } as Location)
})

function startAndGetState(next = "/account") {
  startGoogleRedirect("cid", next)
  const url = new URL(assign.mock.calls[0][0] as string)
  return { url, state: url.searchParams.get("state")! }
}

describe("google redirect sign-in", () => {
  it("builds a token-flow URL back to our callback", () => {
    const url = new URL(buildGoogleAuthUrl("cid", "https://offerupkh.com", "s1"))
    expect(url.origin + url.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth")
    expect(url.searchParams.get("redirect_uri")).toBe("https://offerupkh.com/auth/google/callback")
    expect(url.searchParams.get("response_type")).toBe("token")
    expect(url.searchParams.get("scope")).toBe("openid email profile")
  })

  it("accepts Google's reply for the sign-in this tab started, once", () => {
    const { state } = startAndGetState()
    const hash = `#access_token=ya29.tok&state=${state}&token_type=Bearer`
    expect(consumeGoogleRedirect(hash)).toEqual({ ok: true, accessToken: "ya29.tok", next: "/account" })
    expect(consumeGoogleRedirect(hash)).toMatchObject({ ok: false, reason: "invalid" })
  })

  it("rejects a reply whose state does not match", () => {
    startAndGetState()
    expect(consumeGoogleRedirect("#access_token=x&state=forged")).toMatchObject({ ok: false, reason: "invalid" })
  })

  it("reports a cancelled consent screen", () => {
    startAndGetState()
    expect(consumeGoogleRedirect("#error=access_denied")).toMatchObject({ ok: false, reason: "cancelled", next: "/account" })
  })

  it("never returns to an off-site next path", () => {
    const { state } = startAndGetState("//evil.example")
    expect(consumeGoogleRedirect(`#access_token=t&state=${state}`)).toMatchObject({ ok: true, next: "/" })
  })
})
