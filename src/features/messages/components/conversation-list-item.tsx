import Image from "next/image"
import { SealCheck } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Conversation } from "../types"

interface ConversationListItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diffHours < 48) {
    return "Yesterday"
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  const { participant, listing, lastMessage, updatedAt, unreadCount } = conversation

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 select-none relative group border",
        isSelected
          ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20 text-foreground"
          : "bg-card border-transparent hover:bg-muted/50 hover:border-border/60 text-muted-foreground"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 rounded-full border border-border">
          <AvatarImage src={participant.avatar} alt={participant.name} />
          <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
            {participant.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {participant.verified && (
          <span className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5">
            <SealCheck size={14} weight="fill" className="text-primary" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-1.5">
          <span
            className={cn(
              "text-xs font-bold truncate block",
              unreadCount > 0 ? "text-foreground font-black" : "text-foreground"
            )}
          >
            {participant.name}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
            {formatTime(updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-primary/90 font-medium truncate">
          <span className="truncate">{listing.title}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs truncate leading-tight",
              unreadCount > 0
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            {lastMessage}
          </p>

          {unreadCount > 0 && (
            <Badge className="h-4.5 min-w-4.5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center shrink-0">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-muted border border-border/60 shrink-0 self-center hidden sm:block">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
    </button>
  )
}
