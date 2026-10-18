import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { proxy } from "./proxy"

describe("protected route middleware", () => {
  it("allows account navigation when the site-wide session cookie is present", () => {
    const request = new NextRequest("http://localhost:3000/account/profile", {
      headers: { cookie: "k26_session_dev=opaque-session-token" },
    })

    const response = proxy(request)

    expect(response.headers.get("location")).toBeNull()
  })

  it("redirects signed-out users and preserves the requested page", () => {
    const request = new NextRequest("http://localhost:3000/account/favorites")

    const response = proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?next=%2Faccount%2Ffavorites"
    )
  })

  it("keeps the query string when it sends a signed-out user to sign in", () => {
    const request = new NextRequest("http://localhost:3000/account/listings?status=sold&page=2")

    const response = proxy(request)

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?next=%2Faccount%2Flistings%3Fstatus%3Dsold%26page%3D2"
    )
  })

  it("protects checkout pages", () => {
    const response = proxy(new NextRequest("http://localhost:3000/checkout/abc"))

    expect(response.status).toBe(307)
  })
})

describe("admin hostname routing", () => {
  it("rewrites a clean admin URL to the existing internal route", () => {
    const response = proxy(
      new NextRequest("http://admin.localhost:3000/users?status=active")
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "http://admin.localhost:3000/admin/users?status=active"
    )
  })

  it("serves the separate admin login at /login", () => {
    const response = proxy(
      new NextRequest("http://admin.localhost:3000/login")
    )

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "http://admin.localhost:3000/admin/login"
    )
  })

  it("removes the legacy prefix when it is used on the admin hostname", () => {
    const response = proxy(
      new NextRequest("http://admin.localhost:3000/admin/listings?page=2")
    )

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "http://admin.localhost:3000/listings?page=2"
    )
  })

  it("moves legacy marketplace admin URLs to the admin hostname", () => {
    const response = proxy(
      new NextRequest("http://localhost:3000/admin/verifications?status=pending")
    )

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "http://admin.localhost:3000/verifications?status=pending"
    )
  })
})
