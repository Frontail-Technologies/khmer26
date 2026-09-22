"use client"

import Link from "next/link"
import {
  ArrowLeft,
  DotsThreeVertical,
  SealCheck,
  User,
  ArrowSquareOut,
  Archive,
  Prohibit,
  Flag,
  Tag,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { ConversationParticipant, ConversationListing, ConversationRole } from "../types"

interface ChatHeaderProps {
  participant: ConversationParticipant
  listing: ConversationListing
  role: ConversationRole
  onBack?: () => void
  onOpenMakeOffer?: () => void
  onArchiveConversation?: () => void
  onOpenBlockUser?: () => void
  onOpenReportUser?: () => void
}

export function ChatHeader({
  participant,
  listing,
  role,
  onBack,
  onOpenMakeOffer,
  onArchiveConversation,
  onOpenBlockUser,
  onOpenReportUser,
}: ChatHeaderProps) {
  return (
    <div className="h-14 sm:h-16 px-3 sm:px-4 bg-card border-b border-border/70 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            aria-label="Back to conversations"
            className="md:hidden size-8 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft size={18} weight="bold" />
          </Button>
        )}

        <div className="relative shrink-0">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
              {participant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {participant.verified && (
            <span className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5">
              <SealCheck size={13} weight="fill" className="text-primary" />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
              {participant.name}
            </h2>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {participant.responseTime || "Active on Khmer26"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {role === "buyer" && listing.status === "active" && onOpenMakeOffer && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onOpenMakeOffer}
            className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 text-accent border-accent/30 hover:bg-accent/10 sm:hidden"
          >
            <Tag size={14} weight="bold" />
            <span>Offer</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="More options"
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              render={
                <Link
                  href={`/seller/${participant.slug}`}
                  className="flex items-center gap-2 text-xs font-medium w-full"
                >
                  <User size={15} />
                  <span>View Public Profile</span>
                </Link>
              }
            />

            <DropdownMenuItem
              render={
                <Link
                  href={`/listing/${listing.slug}`}
                  className="flex items-center gap-2 text-xs font-medium w-full"
                >
                  <ArrowSquareOut size={15} />
                  <span>View Listing Details</span>
                </Link>
              }
            />

            {role === "buyer" && listing.status === "active" && onOpenMakeOffer && (
              <DropdownMenuItem
                onClick={onOpenMakeOffer}
                className="gap-2 text-xs font-medium cursor-pointer"
              >
                <Tag size={15} />
                <span>Make a Price Offer</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {onArchiveConversation && (
              <DropdownMenuItem
                onClick={onArchiveConversation}
                className="gap-2 text-xs font-medium cursor-pointer"
              >
                <Archive size={15} />
                <span>Archive Conversation</span>
              </DropdownMenuItem>
            )}

            {onOpenBlockUser && (
              <DropdownMenuItem
                onClick={onOpenBlockUser}
                className="gap-2 text-xs font-medium text-destructive cursor-pointer"
              >
                <Prohibit size={15} />
                <span>Block User</span>
              </DropdownMenuItem>
            )}

            {onOpenReportUser && (
              <DropdownMenuItem
                onClick={onOpenReportUser}
                className="gap-2 text-xs font-medium text-destructive cursor-pointer"
              >
                <Flag size={15} />
                <span>Report User</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
