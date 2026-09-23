"use client"

import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react"
import Image from "next/image"
import {
  Paperclip,
  PaperPlaneRight,
  Tag,
  X,
  Prohibit,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ConversationListing, ConversationRole } from "../types"

interface MessageComposerProps {
  listing: ConversationListing
  role: ConversationRole
  isBlocked: boolean
  onSendMessage: (text: string, attachmentUrl?: string) => void
  onOpenMakeOffer: () => void
}

export function MessageComposer({
  listing,
  role,
  isBlocked,
  onSendMessage,
  onOpenMakeOffer,
}: MessageComposerProps) {
  const [text, setText] = useState("")
  const [stagedImage, setStagedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setStagedImage(preview)
    }
  }

  const handleRemoveStagedImage = () => {
    setStagedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSend = () => {
    if ((!text.trim() && !stagedImage) || isBlocked) return
    onSendMessage(text.trim(), stagedImage || undefined)
    setText("")
    setStagedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  if (isBlocked) {
    return (
      <div className="p-3 bg-muted/40 border-t border-border/70 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Prohibit size={16} className="text-destructive" />
        <span>You blocked this user. Unblock to resume messaging.</span>
      </div>
    )
  }

  return (
    <div className="p-2.5 sm:p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-card border-t border-border/70 space-y-2">
      {stagedImage && (
        <div className="relative inline-block">
          <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-border bg-muted">
            <Image
              src={stagedImage}
              alt="Staged attachment"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveStagedImage}
            className="absolute -top-1.5 -right-1.5 p-0.5 bg-background border border-border rounded-full text-foreground shadow-xs hover:bg-muted"
            aria-label="Remove image"
          >
            <X size={12} weight="bold" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-1.5 sm:gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach photo"
          className="size-10 rounded-xl text-muted-foreground hover:text-foreground shrink-0"
        >
          <Paperclip size={19} />
        </Button>

        {role === "buyer" && listing.status === "active" && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onOpenMakeOffer}
            className="h-10 px-2.5 rounded-xl text-xs font-bold gap-1 text-accent border-accent/30 hover:bg-accent/10 shrink-0 hidden xs:inline-flex"
          >
            <Tag size={15} weight="bold" />
            <span>Offer</span>
          </Button>
        )}

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          className="min-h-10 max-h-24 py-2 px-3 text-base md:text-sm bg-background rounded-xl resize-none flex-1 leading-normal"
        />

        <Button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && !stagedImage}
          size="icon-sm"
          aria-label="Send message"
          className="size-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <PaperPlaneRight size={18} weight="fill" />
        </Button>
      </div>
    </div>
  )
}
