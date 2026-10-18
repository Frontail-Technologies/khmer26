"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getApiBaseUrl } from "@/lib/api/base-url"
import { customerKeys } from "@/lib/query/keys"
import { getWebSocketTicket } from "@/features/messages/api/messages.api"

export function useNotificationSocket(enabled: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return
    let socket: WebSocket | null = null
    let timer: ReturnType<typeof setTimeout> | null = null
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
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data) as { event?: string }
          if (message.event === "notification:new") {
            void queryClient.invalidateQueries({ queryKey: customerKeys.notifications.all })
          }
        }
        socket.onclose = () => { if (!stopped) timer = setTimeout(connect, 2500) }
      } catch {
        if (!stopped) timer = setTimeout(connect, 4000)
      }
    }

    void connect()
    return () => {
      stopped = true
      if (timer) clearTimeout(timer)
      socket?.close()
    }
  }, [enabled, queryClient])
}
