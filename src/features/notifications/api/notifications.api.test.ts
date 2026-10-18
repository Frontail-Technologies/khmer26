import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import {
  getNotifications, getNotificationPreferences, markAllNotificationsRead,
  markNotificationRead, notificationHref, updateNotificationPreferences,
} from "./notifications.api"

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), patch: vi.fn(), post: vi.fn() },
}))

const get = vi.mocked(apiClient.get)
const patch = vi.mocked(apiClient.patch)
const post = vi.mocked(apiClient.post)

describe("customer notifications API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("loads a paginated unread inbox", async () => {
    get.mockResolvedValueOnce({ success: true, data: { items: [], pagination: { page: 2, limit: 20, total: 22, totalPages: 2 } } })
    const result = await getNotifications(2, true)
    expect(result.pagination.total).toBe(22)
    expect(get).toHaveBeenCalledWith("/notifications", { params: { page: 2, limit: 20, unreadOnly: true } })
  })

  it("uses authenticated read and preference routes", async () => {
    get.mockResolvedValueOnce({ success: true, data: { preferences: { newMessages: true } } })
    patch.mockResolvedValue({ success: true, data: { preferences: { newMessages: false } } })
    post.mockResolvedValue({ success: true, data: {} })
    await getNotificationPreferences()
    await updateNotificationPreferences({ newMessages: false })
    await markNotificationRead("notice-1")
    await markAllNotificationsRead()
    expect(get).toHaveBeenCalledWith("/notifications/preferences")
    expect(patch.mock.calls.map(([url]) => url)).toEqual(["/notifications/preferences", "/notifications/notice-1/read"])
    expect(post).toHaveBeenCalledWith("/notifications/read-all")
  })

  it("maps entities to useful destinations and handles legacy offers", () => {
    expect(notificationHref({ entityType: "conversation", entityId: "c1" })).toBe("/messages/c1")
    expect(notificationHref({ entityType: "listing", entityId: "l1" })).toBe("/listing/l1")
    expect(notificationHref({ entityType: "offer", entityId: "old-offer" })).toBe("/messages")
    expect(notificationHref({ entityType: "verification_request", entityId: "v1" })).toBe("/account/profile")
    expect(notificationHref({ entityType: null, entityId: null })).toBe("/account/notifications")
  })
})
