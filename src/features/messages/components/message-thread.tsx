"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { SafetyNotice } from "./safety-notice"
import type { ConversationMessage, ConversationRole } from "../types"

interface MessageThreadProps {
  messages: ConversationMessage[]
  role: ConversationRole
  onAcceptOffer?: (offerId: string) => void
  onDeclineOffer?: (offerId: string) => void
  onWithdrawOffer?: (offerId: string) => void
}

function getDateGroupLabel(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return "Today"
  if (isYesterday) return "Yesterday"
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function MessageThread({
  messages,
  role,
  onAcceptOffer,
  onDeclineOffer,
  onWithdrawOffer,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const groupedMessages: { date: string; items: ConversationMessage[] }[] = []
  for (const msg of messages) {
    const groupLabel = getDateGroupLabel(msg.createdAt)
    const existingGroup = groupedMessages.find((g) => g.date === groupLabel)
    if (existingGroup) {
      existingGroup.items.push(msg)
    } else {
      groupedMessages.push({ date: groupLabel, items: [msg] })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 no-scrollbar">
      <SafetyNotice />

      {groupedMessages.map((group) => (
        <div key={group.date} className="space-y-3">
          <div className="flex items-center justify-center my-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted/60">
              {group.date}
            </span>
          </div>

          <div className="space-y-2">
            {group.items.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                role={role}
                onAcceptOffer={onAcceptOffer}
                onDeclineOffer={onDeclineOffer}
                onWithdrawOffer={onWithdrawOffer}
              />
            ))}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  )
}
