"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MagnifyingGlass,
  ArrowLeft,
  LockSimple,
  Storefront,
  User,
  WarningCircle,
  ChatCircle,
  ChatTeardropText,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type {
  AdminChatParticipant,
  AdminChatConversation,
} from "../types"
import { cn } from "@/lib/utils"

interface AdminChatsWorkspaceProps {
  users: AdminChatParticipant[]
  conversations: AdminChatConversation[]
  initialUserId?: string
  initialConversationId?: string
}

export function AdminChatsWorkspace({
  users,
  conversations,
  initialUserId,
  initialConversationId,
}: AdminChatsWorkspaceProps) {
  const [userSearch, setUserSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialUserId || users[0]?.id || ""
  )
  const [conversationSearch, setConversationSearch] = useState("")
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    initialConversationId || ""
  )
  const [mobileStep, setMobileStep] = useState<"users" | "conversations" | "chat">(
    initialConversationId ? "chat" : initialUserId ? "conversations" : "users"
  )

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users
    const q = userSearch.toLowerCase().trim()
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.businessName && u.businessName.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }, [users, userSearch])

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId) || users[0] || null
  }, [users, selectedUserId])

  const userConversations = useMemo(() => {
    if (!selectedUser) return []
    const allForUser = conversations.filter(
      (c) => c.participantA.id === selectedUser.id || c.participantB.id === selectedUser.id
    )

    if (!conversationSearch.trim()) return allForUser
    const q = conversationSearch.toLowerCase().trim()
    return allForUser.filter((c) => {
      const other = c.participantA.id === selectedUser.id ? c.participantB : c.participantA
      return (
        other.name.toLowerCase().includes(q) ||
        (c.listing && c.listing.title.toLowerCase().includes(q)) ||
        c.lastMessage.toLowerCase().includes(q)
      )
    })
  }, [conversations, selectedUser, conversationSearch])

  const selectedConversation = useMemo(() => {
    if (selectedConversationId) {
      const found = userConversations.find((c) => c.id === selectedConversationId)
      if (found) return found
    }
    return userConversations[0] || null
  }, [userConversations, selectedConversationId])

  const handleSelectUser = (user: AdminChatParticipant) => {
    setSelectedUserId(user.id)
    setSelectedConversationId("")
    setMobileStep("conversations")
  }

  const handleSelectConversation = (conv: AdminChatConversation) => {
    setSelectedConversationId(conv.id)
    setMobileStep("chat")
  }

  const otherParticipant = useMemo(() => {
    if (!selectedConversation || !selectedUser) return null
    return selectedConversation.participantA.id === selectedUser.id
      ? selectedConversation.participantB
      : selectedConversation.participantA
  }, [selectedConversation, selectedUser])

  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs h-[calc(100vh-140px)] min-h-[550px] flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        <div
          className={cn(
            "md:col-span-4 lg:col-span-3 border-r border-border/60 flex flex-col h-full bg-muted/10",
            mobileStep !== "users" && "hidden md:flex"
          )}
        >
          <div className="p-3 border-b border-border/60 bg-muted/20">
            <div className="relative">
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search name, ID, phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full h-8.5 pl-8.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {filteredUsers.length ? (
              filteredUsers.map((user) => {
                const isSelected = selectedUser?.id === user.id
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className={cn(
                      "w-full text-left p-3 transition-colors flex items-center gap-2.5 cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <Avatar className="size-8.5 shrink-0 rounded-full border border-border/60">
                      <AvatarFallback className="text-[11px] font-bold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {user.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                          {user.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="capitalize">{user.accountType}</span>
                        <span className="truncate">{user.phone}</span>
                      </div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No users match your search.
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "md:col-span-8 lg:col-span-4 border-r border-border/60 flex flex-col h-full bg-background",
            mobileStep !== "conversations" && "hidden lg:flex",
            mobileStep === "conversations" && "flex md:col-span-12"
          )}
        >
          <div className="p-3 border-b border-border/60 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMobileStep("users")}
                  className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground"
                  aria-label="Back to users"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Conversations
                  </span>
                  <h4 className="font-bold text-xs text-foreground truncate">
                    {selectedUser?.name || "Select a user"}
                  </h4>
                </div>
              </div>
              {selectedUser && (
                <Badge variant="outline" className="text-[10px] font-semibold capitalize shrink-0">
                  {selectedUser.accountType}
                </Badge>
              )}
            </div>

            <div className="relative">
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={conversationSearch}
                onChange={(e) => setConversationSearch(e.target.value)}
                className="w-full h-8 pl-8.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {userConversations.length ? (
              userConversations.map((conv) => {
                const other =
                  conv.participantA.id === selectedUser?.id
                    ? conv.participantB
                    : conv.participantA
                const isSelected = selectedConversation?.id === conv.id

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelectConversation(conv)}
                    className={cn(
                      "w-full text-left p-3 transition-colors flex items-start gap-2.5 cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <Avatar className="size-8.5 shrink-0 rounded-full border border-border/60 mt-0.5">
                      <AvatarFallback className="text-[11px] font-bold">
                        {other.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {other.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {conv.lastMessageAt.split(",")[1]?.trim() || conv.lastMessageAt}
                        </span>
                      </div>

                      {conv.listing && (
                        <span className="text-[10px] font-medium text-primary block truncate">
                          {conv.listing.title}
                        </span>
                      )}

                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {conv.lastMessage}
                      </p>

                      {conv.isReported && (
                        <div className="pt-0.5">
                          <Badge
                            variant="outline"
                            className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] font-bold px-1.5 py-0 h-4 flex items-center gap-1 w-fit"
                          >
                            <WarningCircle size={10} weight="fill" />
                            <span>Reported</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                <ChatCircle size={28} className="mx-auto text-muted-foreground/50" />
                <p>No conversations found for this user.</p>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "lg:col-span-5 flex flex-col h-full bg-card",
            mobileStep !== "chat" && "hidden lg:flex",
            mobileStep === "chat" && "flex md:col-span-12"
          )}
        >
          {selectedConversation && otherParticipant ? (
            <>
              <div className="p-3 border-b border-border/60 bg-muted/20 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileStep("conversations")}
                      className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <Avatar className="size-8 shrink-0 rounded-full border border-border/60">
                      <AvatarFallback className="text-[10px] font-bold">
                        {otherParticipant.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-foreground truncate">
                        {otherParticipant.name}
                      </h3>
                      <span className="font-mono text-[10px] text-muted-foreground block">
                        {selectedUser?.name} ↔ {otherParticipant.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-[11px] h-7"
                      render={
                        <Link href={`/admin/users/${otherParticipant.id}`}>
                          <User size={12} className="mr-1" />
                          View Account
                        </Link>
                      }
                    />
                    {selectedConversation.isReported && selectedConversation.reportId && (
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-[11px] h-7 bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                        render={
                          <Link href={`/admin/reported-chats?search=${selectedConversation.reportId}`}>
                            <WarningCircle size={12} className="mr-1" />
                            View Report
                          </Link>
                        }
                      />
                    )}
                  </div>
                </div>

                {selectedConversation.listing && (
                  <div className="p-2 rounded-lg bg-background border border-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {selectedConversation.listing.imageUrl && (
                        <div className="relative size-8 rounded overflow-hidden shrink-0 border border-border/60 bg-muted">
                          <Image
                            src={selectedConversation.listing.imageUrl}
                            alt={selectedConversation.listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-semibold text-[11px] text-foreground block truncate">
                          {selectedConversation.listing.title}
                        </span>
                        <span className="font-bold text-[10px] text-primary">
                          ${selectedConversation.listing.price.toLocaleString()}{" "}
                          {selectedConversation.listing.currency}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-6 text-[10px] text-primary shrink-0"
                      render={
                        <Link href={`/admin/listings/${selectedConversation.listing.id}`}>
                          <Storefront size={11} className="mr-1" />
                          Listing
                        </Link>
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/5">
                {selectedConversation.messages.map((msg) => {
                  const isFromSelectedUser = msg.senderId === selectedUser?.id

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        isFromSelectedUser ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1 pb-0.5">
                        <span className="font-semibold">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.createdAt}</span>
                      </div>

                      <div
                        className={cn(
                          "p-3 rounded-xl text-xs leading-relaxed shadow-2xs space-y-1",
                          msg.isReported
                            ? "bg-destructive/10 border border-destructive/40 text-foreground"
                            : isFromSelectedUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-border/70 text-foreground"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.isReported && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-destructive pt-1 border-t border-destructive/20">
                            <WarningCircle size={11} weight="fill" />
                            <span>Reported Message: {msg.flagReason || "Flagged by user"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-3 border-t border-border/60 bg-muted/20 flex items-center justify-center gap-1.5 text-xs text-muted-foreground select-none">
                <LockSimple size={14} className="text-muted-foreground/80" />
                <span>Read-only Admin Inspection Mode</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground space-y-2">
              <ChatTeardropText size={36} className="text-muted-foreground/40" />
              <p className="font-semibold text-foreground">Select a conversation to inspect</p>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Review message history, participant details, and linked marketplace listings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
