import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { middleware } from "./middleware"

describe("protected route middleware", () => {
  it("allows account navigation when the site-wide session cookie is present", () => {
    const request = new NextRequest("http://localhost:3000/account/profile", {
      headers: { cookie: "k26_session_dev=opaque-session-token" },
    })

    const response = middleware(request)

    expect(response.headers.get("location")).toBeNull()
  })

  it("redirects signed-out users and preserves the requested page", () => {
    const request = new NextRequest("http://localhost:3000/account/favorites")

    const response = middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?next=%2Faccount%2Ffavorites"
    )
  })

  it("keeps the query string when it sends a signed-out user to sign in", () => {
    const request = new NextRequest("http://localhost:3000/account/listings?status=sold&page=2")

    const response = middleware(request)

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?next=%2Faccount%2Flistings%3Fstatus%3Dsold%26page%3D2"
    )
  })

  it("protects checkout pages", () => {
    const response = middleware(new NextRequest("http://localhost:3000/checkout/abc"))

    expect(response.status).toBe(307)
  })
})
