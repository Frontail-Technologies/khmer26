"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getApiBaseUrl } from "@/lib/api/base-url"
import { customerKeys } from "@/lib/query/keys"
import { getWebSocketTicket } from "../api/messages.api"
import { patchOfferQueries } from "../lib/offer-cache"

interface ChatSocketPayload {
  event?: string
  data?: {
    conversationId?: string
    offerId?: string
    status?: string
    counterAmount?: number | null
  }
}

export function useChatSocket(conversationId: string | null) {
  const queryClient = useQueryClient()

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let stopped = false

    const connect = async () => {
      try {
        const ticket = await getWebSocketTicket()
        if (stopped) return
        const url = new URL(getApiBaseUrl())
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
        url.pathname = `${url.pathname.replace(/\/$/, "")}/ws`
        url.search = new URLSearchParams({ ticket }).toString()
        socket = new WebSocket(url)
        socket.onopen = () => {
          if (conversationId) socket?.send(JSON.stringify({ event: "chat:join", data: { conversationId } }))
        }
        socket.onmessage = (event) => {
          const payload = JSON.parse(event.data) as ChatSocketPayload
          if (
            payload.event === "offer:updated" &&
            payload.data?.offerId &&
            payload.data.status
          ) {
            patchOfferQueries(
              queryClient,
              {
                offerId: payload.data.offerId,
                status: payload.data.status,
                counterAmount: payload.data.counterAmount,
              },
              payload.data.conversationId
            )
          }
          if (["message:new", "message:read", "offer:new", "offer:updated"].includes(payload.event ?? "")) {
            const id = payload.data?.conversationId
            if (id) void queryClient.invalidateQueries({ queryKey: customerKeys.messages.thread(id) })
            void queryClient.invalidateQueries({ queryKey: customerKeys.conversations.all })
          }
        }
        socket.onclose = () => {
          if (!stopped) reconnectTimer = setTimeout(connect, 2000)
        }
      } catch {
        if (!stopped) reconnectTimer = setTimeout(connect, 3000)
      }
    }

    void connect()
    return () => {
      stopped = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [conversationId, queryClient])
}
