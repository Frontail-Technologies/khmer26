import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import { getAccountProfile, getMyVerification, saveAccountProfile, submitVerification } from "./profile.api"

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}))

const get = vi.mocked(apiClient.get)
const post = vi.mocked(apiClient.post)
const patch = vi.mocked(apiClient.patch)

const profile = {
  id: "profile-1",
  userId: "user-1",
  shopName: "Dara",
  fullName: "Dara Example",
  username: "dara",
  phone: null,
  bio: null,
  avatarMediaId: null,
  avatarR2Key: null,
  coverMediaId: null,
  sellerType: "individual" as const,
  provinceId: null,
  districtId: null,
  provinceName: null,
  districtName: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("account profile API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("loads the authenticated account and owner profile together", async () => {
    const user = { id: "user-1", email: "dara@example.com", emailVerifiedAt: "2026-01-01", createdAt: "2026-01-01" }
    get.mockResolvedValueOnce({ success: true, data: { user } })
    get.mockResolvedValueOnce({ success: true, data: { profile } })
    await expect(getAccountProfile()).resolves.toEqual({ user, sellerProfile: profile })
    expect(get.mock.calls.map(([url]) => url)).toEqual(["/users/me", "/sellers/me"])
  })

  it("creates a first profile and patches an existing profile", async () => {
    const input = {
      shopName: "Dara",
      fullName: "Dara Example",
      username: "dara",
      phone: null,
      bio: null,
      avatarMediaId: null,
      sellerType: "individual" as const,
      provinceId: null,
      districtId: null,
    }
    post.mockResolvedValueOnce({ success: true, data: { profile } })
    patch.mockResolvedValueOnce({ success: true, data: { profile } })
    await saveAccountProfile(null, input)
    await saveAccountProfile(profile.id, input)
    expect(post).toHaveBeenCalledWith("/sellers/me", input)
    expect(patch).toHaveBeenCalledWith("/sellers/me", input)
  })

  it("uses the customer verification routes", async () => {
    get.mockResolvedValueOnce({ success: true, data: { status: "not_submitted", isVerified: false, request: null } })
    post.mockResolvedValueOnce({ success: true, data: {} })
    await getMyVerification()
    await submitVerification({ verificationType: "individual", legalName: "Dara Example", mediaIds: ["media-1"] })
    expect(get).toHaveBeenCalledWith("/sellers/me/verification")
    expect(post).toHaveBeenCalledWith("/sellers/me/verification", {
      verificationType: "individual",
      legalName: "Dara Example",
      mediaIds: ["media-1"],
    })
  })
})
