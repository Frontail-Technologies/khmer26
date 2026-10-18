import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import {
  changePassword,
  deleteAccount,
  getAccountSessions,
  getAuthenticationMethods,
  getPrivacyPreferences,
  logoutOtherSessions,
  revokeAccountSession,
  updatePrivacyPreferences,
} from "./settings.api"

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

const get = vi.mocked(apiClient.get)
const post = vi.mocked(apiClient.post)
const patch = vi.mocked(apiClient.patch)
const remove = vi.mocked(apiClient.delete)

describe("account settings API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("loads and updates persisted privacy preferences", async () => {
    const preferences = {
      showPhoneNumber: false,
      allowBuyersFollow: true,
      showActiveStatus: false,
      showSellerRating: true,
    }
    get.mockResolvedValueOnce({ success: true, data: { preferences } })
    patch.mockResolvedValueOnce({ success: true, data: { preferences } })

    await expect(getPrivacyPreferences()).resolves.toEqual(preferences)
    await expect(updatePrivacyPreferences({ showPhoneNumber: false })).resolves.toEqual(preferences)
    expect(get).toHaveBeenCalledWith("/users/me/privacy")
    expect(patch).toHaveBeenCalledWith("/users/me/privacy", { showPhoneNumber: false })
  })

  it("uses the authenticated session-management endpoints", async () => {
    const sessions = [{ id: "session-1", isCurrent: true }]
    get.mockResolvedValueOnce({ success: true, data: { sessions } })
    remove.mockResolvedValue({ success: true, data: {} })

    await expect(getAccountSessions()).resolves.toEqual(sessions)
    await revokeAccountSession("session/2")
    await logoutOtherSessions()

    expect(get).toHaveBeenCalledWith("/auth/sessions")
    expect(remove).toHaveBeenNthCalledWith(1, "/auth/sessions/session%2F2")
    expect(remove).toHaveBeenNthCalledWith(2, "/auth/sessions")
  })

  it("changes the password and deletes the current account through real API routes", async () => {
    post.mockResolvedValue({ success: true, data: {} })
    remove.mockResolvedValue({ success: true, data: {} })

    await changePassword("Current#123", "Updated#123")
    await deleteAccount()

    expect(post).toHaveBeenCalledWith("/auth/password/change", {
      currentPassword: "Current#123",
      newPassword: "Updated#123",
    })
    expect(remove).toHaveBeenCalledWith("/users/me")
  })

  it("detects social-only accounts so password controls can be hidden", async () => {
    const methods = {
      hasPassword: false,
      providers: [{ id: "provider-1", provider: "google" as const, linkedAt: "2026-10-16", lastUsedAt: null }],
    }
    get.mockResolvedValueOnce({ success: true, data: methods })

    await expect(getAuthenticationMethods()).resolves.toEqual(methods)

    expect(get).toHaveBeenCalledWith("/auth/providers")
  })
})
