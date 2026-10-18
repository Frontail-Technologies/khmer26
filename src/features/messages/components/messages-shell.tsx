"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatCircle, WarningCircle } from "@phosphor-icons/react"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { uploadMediaFile } from "@/lib/api/media"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { markConversationRead } from "../api/messages.api"
import {
  useArchiveConversation, useBlockUser, useConversations, useConversationMessages,
  useCounterOffer, useCreateOffer, useOfferAction, useSendImage, useSendMessage, useUnarchiveConversation, useUnblockUser,
} from "../api/messages.queries"
import { useChatSocket } from "../hooks/use-chat-socket"
import { ConversationList } from "./conversation-list"
import { ChatHeader } from "./chat-header"
import { MessageThread } from "./message-thread"
import { MessageComposer } from "./message-composer"
import { MobileListingContext } from "./mobile-listing-context"
import { ListingContextPanel } from "./listing-context-panel"
import { MakeOfferDialog } from "./make-offer-dialog"
import { BlockUserDialog } from "./block-user-dialog"
import { ReportUserDialog } from "./report-user-dialog"
import { CounterOfferDialog } from "./counter-offer-dialog"

interface MessagesShellProps { activeConversationId?: string | null }

export function MessagesShell({ activeConversationId = null }: MessagesShellProps) {
  const tGenerated = useTranslations("generated")
  const tUi = useTranslations("ui.common")
  const tMessages = useTranslations("ui.messages")
  const router = useRouter()
  const { user } = useCurrentUser()
  const conversationsQuery = useConversations()
  const conversations = conversationsQuery.data?.items ?? []
  const [selectedId, setSelectedId] = useState<string | null>(activeConversationId)
  const [routeId, setRouteId] = useState(activeConversationId)
  // Back/forward navigation changes the route; keep the selection in step with it.
  if (routeId !== activeConversationId) {
    setRouteId(activeConversationId)
    setSelectedId(activeConversationId)
  }
  const activeConversation = conversations.find((conversation) => conversation.id === selectedId) ?? null
  const messagesQuery = useConversationMessages(selectedId, activeConversation?.listing.price ?? 0)
  const sendMessage = useSendMessage()
  const sendImage = useSendImage()
  const createOffer = useCreateOffer()
  const offerAction = useOfferAction()
  const counterOffer = useCounterOffer()
  const archive = useArchiveConversation()
  const unarchive = useUnarchiveConversation()
  const block = useBlockUser()
  const unblock = useUnblockUser()
  const [isUploading, setIsUploading] = useState(false)
  const [makeOfferOpen, setMakeOfferOpen] = useState(false)
  const [blockUserOpen, setBlockUserOpen] = useState(false)
  const [reportUserOpen, setReportUserOpen] = useState(false)
  const [counterOfferId, setCounterOfferId] = useState<string | null>(null)

  useChatSocket(selectedId)

  useEffect(() => {
    if (!selectedId) return
    void markConversationRead(selectedId).then(() => conversationsQuery.refetch()).catch(() => undefined)
  }, [selectedId, messagesQuery.data?.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (text: string, file?: File) => {
    if (!selectedId) return
    if (!file) {
      await sendMessage.mutateAsync({ conversationId: selectedId, text })
      return
    }
    setIsUploading(true)
    try {
      const uploaded = await uploadMediaFile(file, "chat_image")
      await sendImage.mutateAsync({ conversationId: selectedId, mediaId: uploaded.mediaId, text: text || undefined })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tMessages("photoFailed"))
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  if (conversationsQuery.isPending) {
    return <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground"><LocalizedText id="loadingConversations" /></div>
  }

  if (conversationsQuery.isError) {
    return (
      <div className="flex h-dvh items-center justify-center p-6">
        <EmptyState icon={<WarningCircle size={36} />} title={tGenerated("couldNotLoadMessages")} description={tUi("checkConnection")} action={{ label: tUi("tryAgain"), onClick: () => void conversationsQuery.refetch() }} />
      </div>
    )
  }

  return (
    <div className="h-dvh flex bg-background overflow-hidden">
      <div className={`${activeConversation ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 shrink-0 h-full`}>
        <ConversationList conversations={conversations} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); router.push(`/messages/${id}`) }} className="w-full" />
      </div>

      {activeConversation ? (
        <div className="flex-1 flex min-w-0 h-full">
          <main className="flex-1 flex flex-col min-w-0 h-full bg-background relative">
            <ChatHeader participant={activeConversation.participant} listing={activeConversation.listing} role={activeConversation.role} isBlocked={activeConversation.blocked} isArchived={activeConversation.archived} onBack={() => { setSelectedId(null); router.push("/messages") }} onOpenMakeOffer={() => setMakeOfferOpen(true)} onArchiveConversation={() => (activeConversation.archived ? unarchive : archive).mutate(activeConversation.id, { onSuccess: () => { setSelectedId(null); router.push("/messages") } })} onOpenBlockUser={() => setBlockUserOpen(true)} onOpenReportUser={() => setReportUserOpen(true)} />
            <MobileListingContext listing={activeConversation.listing} />
            {messagesQuery.isPending ? (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground"><LocalizedText id="loadingMessages" /></div>
            ) : messagesQuery.isError ? (
              <div className="flex flex-1 items-center justify-center"><Button variant="outline" onClick={() => messagesQuery.refetch()}><LocalizedText id="retryMessages" /></Button></div>
            ) : (
              <MessageThread messages={messagesQuery.data} role={activeConversation.role} currentUserId={user?.id ?? ""} onAcceptOffer={(offerId) => offerAction.mutate({ offerId, action: "accept" })} onDeclineOffer={(offerId) => offerAction.mutate({ offerId, action: "reject" })} onWithdrawOffer={(offerId) => offerAction.mutate({ offerId, action: "withdraw" })} onCounterOffer={setCounterOfferId} />
            )}
            <MessageComposer listing={activeConversation.listing} role={activeConversation.role} isBlocked={activeConversation.blocked} isSending={sendMessage.isPending || sendImage.isPending || isUploading} onSendMessage={handleSend} onOpenMakeOffer={() => setMakeOfferOpen(true)} />
          </main>
          <div className="hidden lg:block"><ListingContextPanel listing={activeConversation.listing} participant={activeConversation.participant} role={activeConversation.role} onOpenMakeOffer={() => setMakeOfferOpen(true)} /></div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-card/40 border-l border-border/70">
          <EmptyState icon={<ChatCircle size={36} className="text-muted-foreground" />} title={conversations.length ? tGenerated("selectAConversation") : tGenerated("noConversationsYet")} description={conversations.length ? tGenerated("chooseABuyerOrSellerFromYourInbox") : tGenerated("startAChatFromAnyActiveListing")} />
        </div>
      )}

      {activeConversation && <>
        <MakeOfferDialog listing={activeConversation.listing} open={makeOfferOpen} onOpenChange={setMakeOfferOpen} isSubmitting={createOffer.isPending} onSubmitOffer={(amount, note) => createOffer.mutate({ conversationId: activeConversation.id, amount, currency: activeConversation.listing.currency, note }, { onSuccess: () => setMakeOfferOpen(false) })} />
        <BlockUserDialog participant={activeConversation.participant} isBlocked={activeConversation.blocked} open={blockUserOpen} onOpenChange={setBlockUserOpen} onConfirmBlock={() => (activeConversation.blocked ? unblock : block).mutate(activeConversation.participant.id)} />
        <ReportUserDialog participant={activeConversation.participant} conversationId={activeConversation.id} open={reportUserOpen} onOpenChange={setReportUserOpen} />
        <CounterOfferDialog key={counterOfferId} open={Boolean(counterOfferId)} currency={activeConversation.listing.currency} initialAmount={activeConversation.listing.price} isSubmitting={counterOffer.isPending} onOpenChange={(open) => { if (!open) setCounterOfferId(null) }} onSubmit={(amount) => { if (counterOfferId) counterOffer.mutate({ offerId: counterOfferId, amount }, { onSuccess: () => setCounterOfferId(null) }) }} />
      </>}
    </div>
  )
}
