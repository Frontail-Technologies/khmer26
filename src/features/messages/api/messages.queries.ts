"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { customerKeys } from "@/lib/query/keys"
import { ApiError } from "@/lib/api/client"
import type { ConversationMessage } from "../types"
import { patchOfferQueries } from "../lib/offer-cache"
import * as api from "./messages.api"

const errorMessage = (error: unknown) => error instanceof ApiError ? error.message : "The chat could not be updated."

export function useConversations() {
  return useQuery({
    queryKey: customerKeys.conversations.list({ archived: "all" }),
    queryFn: () => api.getConversations(),
  })
}

export function useConversationMessages(conversationId: string | null, askingPrice: number) {
  return useQuery({
    queryKey: customerKeys.messages.thread(conversationId ?? ""),
    queryFn: () => api.getMessages(conversationId!, askingPrice),
    enabled: Boolean(conversationId),
  })
}

function useChatMutation<T>(mutationFn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.conversations.all })
      void queryClient.invalidateQueries({ queryKey: customerKeys.messages.all })
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
}

export const useSendMessage = () => useChatMutation((input: { conversationId: string; text: string }) => api.sendTextMessage(input.conversationId, input.text))
export const useSendImage = () => useChatMutation((input: { conversationId: string; mediaId: string; text?: string }) => api.sendImageMessage(input.conversationId, input.mediaId, input.text))
export const useArchiveConversation = () => useChatMutation(api.archiveConversation)
export const useUnarchiveConversation = () => useChatMutation(api.unarchiveConversation)
export const useBlockUser = () => useChatMutation(api.blockUser)
export const useUnblockUser = () => useChatMutation(api.unblockUser)
export const useCreateOffer = () => useChatMutation((input: { conversationId: string; amount: number; currency: string; note?: string }) => api.createOffer(input.conversationId, input.amount, input.currency, input.note))
export function useOfferAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { offerId: string; action: api.OfferAction }) =>
      api.updateOffer(input.offerId, input.action),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.messages.all })
      const previous = queryClient.getQueriesData<ConversationMessage[]>({
        queryKey: customerKeys.messages.all,
      })

      patchOfferQueries(queryClient, {
        offerId: input.offerId,
        status: input.action === "reject" ? "rejected" : input.action === "accept" ? "accepted" : "withdrawn",
      })

      return { previous }
    },
    onSuccess: (response) => {
      patchOfferQueries(queryClient, response.data, response.data.conversationId)
    },
    onError: (error, _input, context) => {
      context?.previous.forEach(([queryKey, messages]) => {
        queryClient.setQueryData(queryKey, messages)
      })
      toast.error(errorMessage(error))
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.conversations.all })
      void queryClient.invalidateQueries({ queryKey: customerKeys.messages.all })
    },
  })
}
export const useCounterOffer = () => useChatMutation((input: { offerId: string; amount: number }) => api.counterOffer(input.offerId, input.amount))

export function useChatReportReasons(enabled: boolean) {
  return useQuery({ queryKey: ["reports", "reasons", "chat"], queryFn: api.getChatReportReasons, enabled })
}

export const useReportConversation = () => useChatMutation((input: { conversationId: string; reasonId: string; details?: string }) => api.reportConversation(input.conversationId, input.reasonId, input.details))
