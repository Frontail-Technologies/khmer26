import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import { createOffer, getConversations, getMessages, reportConversation, sendImageMessage } from "./messages.api"

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))
vi.mock("@/lib/media/get-media-url", () => ({ getMediaUrl: (key?: string | null) => key ? `https://cdn.test/${key}` : null }))

const get = vi.mocked(apiClient.get)
const post = vi.mocked(apiClient.post)

describe("customer chat API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("maps conversation summaries without exposing internal ids as labels", async () => {
    get.mockResolvedValueOnce({ success: true, data: {
      items: [{
        id: "conversation-1", role: "buyer", unreadCount: 2, isArchived: false, isBlocked: false,
        lastMessageAt: "2026-10-15T10:00:00Z", lastMessage: { text: "Still available", createdAt: "2026-10-15T10:00:00Z" },
        listing: { id: "listing-1", title: "Toyota Prius", price: "12000.00", currency: "USD", status: "active", negotiable: true, location: "Phnom Penh", imageR2Key: "listing.jpg" },
        otherParticipant: { userId: "seller-user", sellerProfileId: "seller-profile", shopName: "Dara Motors", sellerType: "dealer", avatarR2Key: "avatar.jpg", isVerified: true },
      }],
      pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
    } })

    const result = await getConversations()
    expect(result.items[0]).toMatchObject({
      participant: { name: "Dara Motors", slug: "seller-profile", verified: true },
      listing: { title: "Toyota Prius", price: 12000, imageUrl: "https://cdn.test/listing.jpg" },
      unreadCount: 2,
    })
    expect(get).toHaveBeenCalledWith("/chat/conversations", { params: { page: 1, limit: 50, archived: undefined } })
  })

  it("maps rejected offers and resolves persisted chat images", async () => {
    get.mockResolvedValueOnce({ success: true, data: { items: [{
      id: "message-1", conversationId: "conversation-1", senderUserId: "buyer", isOutgoing: true,
      type: "offer", text: "offer", media: null, createdAt: "2026-10-15T10:00:00Z",
      offer: { id: "offer-1", amount: 100, currency: "USD", status: "rejected", counterAmount: null, note: "Cash" },
    }, {
      id: "message-2", conversationId: "conversation-1", senderUserId: "seller", isOutgoing: false,
      type: "image", text: "Receipt", media: { r2Key: "chat/photo.jpg", originalFilename: "photo.jpg" }, offer: null,
      createdAt: "2026-10-15T10:01:00Z",
    }] } })

    const messages = await getMessages("conversation-1", 120)
    expect(messages[0]?.offer).toMatchObject({ status: "declined", askingPrice: 120, message: "Cash" })
    expect(messages[1]?.imageUrl).toBe("https://cdn.test/chat/photo.jpg")
  })

  it("uses the authenticated image, offer, and report endpoints", async () => {
    post.mockResolvedValue({ success: true, data: {} })
    await sendImageMessage("c1", "m1", "Photo")
    await createOffer("c1", 95, "USD", "Cash today")
    await reportConversation("c1", "r1", "Suspicious link")
    expect(post.mock.calls.map(([url]) => url)).toEqual([
      "/chat/conversations/c1/messages",
      "/chat/conversations/c1/offers",
      "/reports/chat/c1",
    ])
  })
})
