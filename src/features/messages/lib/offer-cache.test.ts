import { describe, expect, it } from "vitest"
import type { ConversationMessage } from "../types"
import { normalizeOfferStatus, updateOfferInMessages } from "./offer-cache"

const messages: ConversationMessage[] = [
  {
    id: "message-1",
    conversationId: "conversation-1",
    senderId: "buyer-1",
    type: "offer",
    createdAt: "2026-10-16T10:00:00Z",
    status: "sent",
    offer: {
      id: "offer-1",
      amount: 100,
      askingPrice: 120,
      status: "pending",
      createdAt: "2026-10-16T10:00:00Z",
      currency: "USD",
      senderId: "buyer-1",
    },
  },
]

describe("offer cache updates", () => {
  it("maps the backend rejected status to the frontend declined status", () => {
    expect(normalizeOfferStatus("rejected")).toBe("declined")
  })

  it("updates the matching offer without mutating the cached messages", () => {
    const updated = updateOfferInMessages(messages, {
      offerId: "offer-1",
      status: "accepted",
    })

    expect(updated).not.toBe(messages)
    expect(updated?.[0]?.offer?.status).toBe("accepted")
    expect(messages[0]?.offer?.status).toBe("pending")
  })

  it("applies counter amounts and leaves unrelated offers unchanged", () => {
    const updated = updateOfferInMessages(messages, {
      offerId: "offer-1",
      status: "countered",
      counterAmount: 110,
    })
    const unchanged = updateOfferInMessages(messages, {
      offerId: "another-offer",
      status: "accepted",
    })

    expect(updated?.[0]?.offer).toMatchObject({ status: "countered", amount: 110 })
    expect(unchanged).toBe(messages)
  })
})
