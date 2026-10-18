import { beforeEach, describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/api/client"
import { getAdminChatConversationMessages } from "./chats.api"

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn() },
}))

const get = vi.mocked(apiClient.get)

describe("admin chats API", () => {
  beforeEach(() => vi.clearAllMocks())

  it("preserves image attachment URLs when mapping conversation messages", async () => {
    get.mockResolvedValueOnce({
      success: true,
      data: {
        conversation: {
          displayId: "CHAT4428",
          listing: null,
          participants: [
            { userId: "sender-1", shopName: "Dara Shop", email: "dara@example.com" },
          ],
        },
        messages: [
          {
            id: "message-1",
            conversationId: "conversation-1",
            senderUserId: "sender-1",
            type: "image",
            body: "Receipt",
            media: {
              id: "media-1",
              url: "https://cdn.example.com/chat/receipt.jpg",
              originalFilename: "receipt.jpg",
              mimeType: "image/jpeg",
              sizeBytes: 1024,
            },
            createdAt: "2026-10-16T10:00:00.000Z",
          },
        ],
      },
    })

    const result = await getAdminChatConversationMessages("conversation-1")

    expect(result.messages[0]).toMatchObject({
      type: "image",
      text: "Receipt",
      imageUrl: "https://cdn.example.com/chat/receipt.jpg",
      imageAlt: "receipt.jpg",
    })
  })
})
