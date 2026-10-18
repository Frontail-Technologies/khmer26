import type { QueryClient } from "@tanstack/react-query"
import { customerKeys } from "@/lib/query/keys"
import type { ConversationMessage, OfferStatus } from "../types"

export interface OfferCacheUpdate {
  offerId: string
  status: string
  counterAmount?: number | null
}

export function normalizeOfferStatus(status: string): OfferStatus {
  return status === "rejected" ? "declined" : status as OfferStatus
}

export function updateOfferInMessages(
  messages: ConversationMessage[] | undefined,
  update: OfferCacheUpdate
): ConversationMessage[] | undefined {
  if (!messages) return messages

  let changed = false
  const status = normalizeOfferStatus(update.status)
  const next = messages.map((message) => {
    if (message.offer?.id !== update.offerId) return message

    changed = true
    return {
      ...message,
      offer: {
        ...message.offer,
        status,
        ...(typeof update.counterAmount === "number"
          ? { amount: update.counterAmount }
          : {}),
      },
    }
  })

  return changed ? next : messages
}

export function patchOfferQueries(
  queryClient: QueryClient,
  update: OfferCacheUpdate,
  conversationId?: string
) {
  if (conversationId) {
    queryClient.setQueryData<ConversationMessage[]>(
      customerKeys.messages.thread(conversationId),
      (messages) => updateOfferInMessages(messages, update)
    )
    return
  }

  queryClient.setQueriesData<ConversationMessage[]>(
    { queryKey: customerKeys.messages.all },
    (messages) => updateOfferInMessages(messages, update)
  )
}
