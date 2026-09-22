"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChatCircle } from "@phosphor-icons/react"
import { EmptyState } from "@/components/shared/EmptyState"
import { ConversationList } from "./conversation-list"
import { ChatHeader } from "./chat-header"
import { MessageThread } from "./message-thread"
import { MessageComposer } from "./message-composer"
import { MobileListingContext } from "./mobile-listing-context"
import { ListingContextPanel } from "./listing-context-panel"
import { MakeOfferDialog } from "./make-offer-dialog"
import { BlockUserDialog } from "./block-user-dialog"
import { ReportUserDialog } from "./report-user-dialog"
import { DEMO_CONVERSATIONS, CURRENT_USER_ID } from "../data/demo-conversations"
import type { Conversation, ConversationMessage, ConversationOffer } from "../types"

interface MessagesShellProps {
  initialConversations?: Conversation[]
  activeConversationId?: string | null
}

export function MessagesShell({
  initialConversations = DEMO_CONVERSATIONS,
  activeConversationId = null,
}: MessagesShellProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string | null>(activeConversationId)

  const [makeOfferOpen, setMakeOfferOpen] = useState(false)
  const [blockUserOpen, setBlockUserOpen] = useState(false)
  const [reportUserOpen, setReportUserOpen] = useState(false)

  const activeConversation = conversations.find((c) => c.id === selectedId) || null

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
    router.push(`/messages/${id}`)
  }

  const handleBackToInbox = () => {
    setSelectedId(null)
    router.push("/messages")
  }

  const handleSendMessage = (text: string, attachmentUrl?: string) => {
    if (!activeConversation) return

    const newMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: CURRENT_USER_ID,
      type: attachmentUrl ? "image" : "text",
      content: text || undefined,
      imageUrl: attachmentUrl,
      createdAt: new Date().toISOString(),
      status: "sent",
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text || "Sent an attachment",
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const handleSubmitOffer = (amount: number, note?: string) => {
    if (!activeConversation) return

    const newOffer: ConversationOffer = {
      id: `off-${Date.now()}`,
      amount,
      askingPrice: activeConversation.listing.price,
      status: "pending",
      createdAt: new Date().toISOString(),
      currency: activeConversation.listing.currency,
      message: note,
      senderId: CURRENT_USER_ID,
    }

    const offerMessage: ConversationMessage = {
      id: `msg-off-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: CURRENT_USER_ID,
      type: "offer",
      offer: newOffer,
      createdAt: new Date().toISOString(),
      status: "sent",
    }

    const systemMessage: ConversationMessage = {
      id: `msg-sys-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: CURRENT_USER_ID,
      type: "system",
      content: `You made an offer of $${amount.toLocaleString()}`,
      createdAt: new Date().toISOString(),
      status: "sent",
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c
        return {
          ...c,
          messages: [...c.messages, offerMessage, systemMessage],
          lastMessage: `Offer made: $${amount.toLocaleString()}`,
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const handleAcceptOffer = (offerId: string) => {
    if (!activeConversation) return

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c
        const updatedMessages = c.messages.map((m) => {
          if (m.offer && m.offer.id === offerId) {
            return {
              ...m,
              offer: { ...m.offer, status: "accepted" as const },
            }
          }
          return m
        })

        const systemMessage: ConversationMessage = {
          id: `msg-sys-${Date.now()}`,
          conversationId: c.id,
          senderId: CURRENT_USER_ID,
          type: "system",
          content: "Offer accepted! You can now arrange payment and pickup.",
          createdAt: new Date().toISOString(),
          status: "sent",
        }

        return {
          ...c,
          messages: [...updatedMessages, systemMessage],
          lastMessage: "Offer accepted",
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const handleDeclineOffer = (offerId: string) => {
    if (!activeConversation) return

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c
        const updatedMessages = c.messages.map((m) => {
          if (m.offer && m.offer.id === offerId) {
            return {
              ...m,
              offer: { ...m.offer, status: "declined" as const },
            }
          }
          return m
        })

        const systemMessage: ConversationMessage = {
          id: `msg-sys-${Date.now()}`,
          conversationId: c.id,
          senderId: CURRENT_USER_ID,
          type: "system",
          content: "Offer was declined.",
          createdAt: new Date().toISOString(),
          status: "sent",
        }

        return {
          ...c,
          messages: [...updatedMessages, systemMessage],
          lastMessage: "Offer declined",
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const handleWithdrawOffer = (offerId: string) => {
    if (!activeConversation) return

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c
        const updatedMessages = c.messages.map((m) => {
          if (m.offer && m.offer.id === offerId) {
            return {
              ...m,
              offer: { ...m.offer, status: "withdrawn" as const },
            }
          }
          return m
        })

        const systemMessage: ConversationMessage = {
          id: `msg-sys-${Date.now()}`,
          conversationId: c.id,
          senderId: CURRENT_USER_ID,
          type: "system",
          content: "You withdrew your offer.",
          createdAt: new Date().toISOString(),
          status: "sent",
        }

        return {
          ...c,
          messages: [...updatedMessages, systemMessage],
          lastMessage: "Offer withdrawn",
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const handleArchiveConversation = () => {
    if (!activeConversation) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, archived: true } : c))
    )
    setSelectedId(null)
    router.push("/messages")
  }

  const handleConfirmBlockUser = () => {
    if (!activeConversation) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, blocked: true } : c))
    )
  }

  return (
    <div className="h-dvh flex bg-background overflow-hidden">
      <div
        className={`${
          activeConversation ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 shrink-0 h-full`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
          className="w-full"
        />
      </div>

      {activeConversation ? (
        <div className="flex-1 flex min-w-0 h-full">
          <main className="flex-1 flex flex-col min-w-0 h-full bg-background relative">
            <ChatHeader
              participant={activeConversation.participant}
              listing={activeConversation.listing}
              role={activeConversation.role}
              onBack={handleBackToInbox}
              onOpenMakeOffer={() => setMakeOfferOpen(true)}
              onArchiveConversation={handleArchiveConversation}
              onOpenBlockUser={() => setBlockUserOpen(true)}
              onOpenReportUser={() => setReportUserOpen(true)}
            />

            <MobileListingContext listing={activeConversation.listing} />

            <MessageThread
              messages={activeConversation.messages}
              role={activeConversation.role}
              onAcceptOffer={handleAcceptOffer}
              onDeclineOffer={handleDeclineOffer}
              onWithdrawOffer={handleWithdrawOffer}
            />

            <MessageComposer
              listing={activeConversation.listing}
              role={activeConversation.role}
              isBlocked={activeConversation.blocked}
              onSendMessage={handleSendMessage}
              onOpenMakeOffer={() => setMakeOfferOpen(true)}
            />
          </main>

          <div className="hidden lg:block">
            <ListingContextPanel
              listing={activeConversation.listing}
              participant={activeConversation.participant}
              role={activeConversation.role}
              onOpenMakeOffer={() => setMakeOfferOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-card/40 border-l border-border/70">
          <EmptyState
            icon={<ChatCircle size={36} className="text-muted-foreground" />}
            title="Select a conversation"
            description="Choose a buyer or seller from your inbox on the left to start chatting."
          />
        </div>
      )}

      {activeConversation && (
        <>
          <MakeOfferDialog
            listing={activeConversation.listing}
            open={makeOfferOpen}
            onOpenChange={setMakeOfferOpen}
            onSubmitOffer={handleSubmitOffer}
          />

          <BlockUserDialog
            participant={activeConversation.participant}
            open={blockUserOpen}
            onOpenChange={setBlockUserOpen}
            onConfirmBlock={handleConfirmBlockUser}
          />

          <ReportUserDialog
            participant={activeConversation.participant}
            open={reportUserOpen}
            onOpenChange={setReportUserOpen}
          />
        </>
      )}
    </div>
  )
}
