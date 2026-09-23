import { Check, Checks, Clock } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { ImageMessage } from "./image-message"
import { OfferMessageCard } from "./offer-message-card"
import { SystemMessage } from "./system-message"
import type { ConversationMessage, ConversationRole, MessageStatus } from "../types"
import { CURRENT_USER_ID } from "../data/demo-conversations"

interface MessageBubbleProps {
  message: ConversationMessage
  role: ConversationRole
  showTimestamp?: boolean
  onAcceptOffer?: (offerId: string) => void
  onDeclineOffer?: (offerId: string) => void
  onWithdrawOffer?: (offerId: string) => void
}

function formatMessageTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function StatusIcon({ status }: { status: MessageStatus }) {
  if (status === "sending") return <Clock size={12} className="text-muted-foreground" />
  if (status === "sent") return <Check size={12} className="text-muted-foreground" />
  if (status === "delivered") return <Checks size={13} className="text-muted-foreground" />
  if (status === "read") return <Checks size={13} className="text-primary font-bold" />
  return null
}

export function MessageBubble({
  message,
  role,
  showTimestamp = true,
  onAcceptOffer,
  onDeclineOffer,
  onWithdrawOffer,
}: MessageBubbleProps) {
  if (message.type === "system" && message.content) {
    return <SystemMessage content={message.content} />
  }

  const isCurrentUser = message.senderId === CURRENT_USER_ID

  return (
    <div
      className={cn(
        "flex flex-col gap-1 w-full",
        isCurrentUser ? "items-end" : "items-start"
      )}
    >
      {message.type === "offer" && message.offer ? (
        <OfferMessageCard
          offer={message.offer}
          role={role}
          isCurrentUserSender={isCurrentUser}
          onAcceptOffer={onAcceptOffer}
          onDeclineOffer={onDeclineOffer}
          onWithdrawOffer={onWithdrawOffer}
        />
      ) : message.type === "image" && message.imageUrl ? (
        <ImageMessage
          imageUrl={message.imageUrl}
          imageAlt={message.imageAlt}
          content={message.content}
          isCurrentUser={isCurrentUser}
        />
      ) : (
        <div
          className={cn(
            "max-w-[85%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-xs shadow-2xs font-normal"
              : "bg-muted/80 text-foreground border border-border/60 rounded-bl-xs"
          )}
        >
          {message.content}
        </div>
      )}

      {showTimestamp && (
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] text-muted-foreground px-1",
            isCurrentUser ? "justify-end" : "justify-start"
          )}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isCurrentUser && <StatusIcon status={message.status} />}
        </div>
      )}
    </div>
  )
}
