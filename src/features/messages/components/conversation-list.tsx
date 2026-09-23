"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { MagnifyingGlass, ChatCircle, ArrowLeft } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { ConversationListItem } from "./conversation-list-item"
import type { Conversation } from "../types"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  className?: string
}

type FilterType = "all" | "buying" | "selling" | "unread"

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  className,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => !c.archived)
      .filter((c) => {
        if (filter === "buying") return c.role === "buyer"
        if (filter === "selling") return c.role === "seller"
        if (filter === "unread") return c.unreadCount > 0
        return true
      })
      .filter((c) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          c.participant.name.toLowerCase().includes(q) ||
          c.listing.title.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
        )
      })
  }, [conversations, filter, searchQuery])

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border/70", className)}>
      <div className="p-3 sm:p-3.5 space-y-2.5 border-b border-border/70 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft size={18} weight="bold" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Messages
            </h1>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-background rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
          {[
            { id: "all" as const, label: "All" },
            { id: "buying" as const, label: "Buying" },
            { id: "selling" as const, label: "Selling" },
            { id: "unread" as const, label: "Unread" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none shrink-0",
                filter === item.id
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
        {filtered.length > 0 ? (
          filtered.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        ) : (
          <div className="py-12 px-4 text-center space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
              <ChatCircle size={20} />
            </div>
            <p className="text-xs font-bold text-foreground">No conversations found</p>
            <p className="text-[11px] text-muted-foreground">
              {searchQuery ? "Try different search keywords" : "Start browsing marketplace ads"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
