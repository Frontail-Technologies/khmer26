import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "@/test/test-utils"
import type { ConversationListing } from "../types"
import { MessageComposer } from "./message-composer"

const listing = { id: "l1", title: "Honda Civic", price: 100, currency: "USD" } as unknown as ConversationListing

function renderComposer(onSendMessage: (text: string) => Promise<void>) {
  renderWithProviders(
    <MessageComposer listing={listing} role="buyer" isBlocked={false} onSendMessage={onSendMessage} onOpenMakeOffer={vi.fn()} />
  )
  const box = screen.getByRole("textbox") as HTMLTextAreaElement
  return { box, send: () => fireEvent.keyDown(box, { key: "Enter" }) }
}

describe("<MessageComposer />", () => {
  it("clears the message once it has been sent", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined)
    const { box, send } = renderComposer(onSend)

    fireEvent.change(box, { target: { value: "Is it available?" } })
    send()

    await waitFor(() => expect(box.value).toBe(""))
    expect(onSend).toHaveBeenCalledWith("Is it available?", undefined)
  })

  it("keeps the message when sending fails so it can be retried", async () => {
    const onSend = vi.fn().mockRejectedValue(new Error("offline"))
    const { box, send } = renderComposer(onSend)

    fireEvent.change(box, { target: { value: "Is it available?" } })
    send()

    await waitFor(() => expect(onSend).toHaveBeenCalled())
    expect(box.value).toBe("Is it available?")
  })
})
