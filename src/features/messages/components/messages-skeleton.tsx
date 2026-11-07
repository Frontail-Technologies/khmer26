"use client"

import { useTranslations } from "next-intl"
import { ArrowLeft } from "@phosphor-icons/react"
import { LocalizedText } from "@/components/i18n/localized-text"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/** One conversation row placeholder: avatar, name + time, listing line, last message. */
function ConversationRowSkeleton({ wide }: { wide: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl px-2.5 py-2.5">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className={cn("h-3.5", wide ? "w-2/5" : "w-1/3")} />
          <Skeleton className="h-2.5 w-8" />
        </div>
        <Skeleton className={cn("h-2.5", wide ? "w-3/5" : "w-1/2")} />
        <Skeleton className={cn("h-2.5", wide ? "w-4/5" : "w-2/3")} />
      </div>
      <Skeleton className="size-10 shrink-0 rounded-lg" />
    </div>
  )
}

/**
 * Inbox while conversations load: the real header (so the screen doesn't jump when data
 * arrives) over placeholder rows, laid out like ConversationList.
 */
export function ConversationListSkeleton({ className }: { className?: string }) {
  const tGenerated = useTranslations("generated")
  return (
    <div className={cn("flex h-full flex-col border-r border-border/70 bg-card", className)} aria-busy="true" aria-label={tGenerated("loadingConversations")}>
      <div className="space-y-2.5 border-b border-border/70 bg-card p-3 sm:p-3.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center text-muted-foreground" aria-hidden="true">
            <ArrowLeft size={18} weight="bold" />
          </span>
          <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            <LocalizedText id="messages_f1702b" />
          </h1>
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
        <div className="flex gap-1 pt-0.5">
          {[10, 14, 13, 13, 16].map((w, i) => (
            <Skeleton key={i} className="h-6 rounded-lg" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <ConversationRowSkeleton key={i} wide={i % 2 === 0} />
        ))}
      </div>
    </div>
  )
}

/** Chat thread while messages load: alternating bubbles, like MessageThread. */
export function MessageThreadSkeleton() {
  const tGenerated = useTranslations("generated")
  const bubbles: Array<{ mine: boolean; w: string; h: string }> = [
    { mine: false, w: "w-3/5", h: "h-10" },
    { mine: true, w: "w-2/5", h: "h-8" },
    { mine: false, w: "w-1/2", h: "h-14" },
    { mine: true, w: "w-3/5", h: "h-10" },
    { mine: false, w: "w-1/3", h: "h-8" },
    { mine: true, w: "w-1/2", h: "h-12" },
  ]
  return (
    <div className="flex flex-1 flex-col justify-end gap-3 overflow-hidden px-3 py-4 sm:px-5" aria-busy="true" aria-label={tGenerated("loadingMessages")}>
      <Skeleton className="mx-auto h-4 w-24 rounded-full" />
      {bubbles.map((b, i) => (
        <div key={i} className={cn("flex", b.mine ? "justify-end" : "justify-start")}>
          <Skeleton className={cn(b.w, b.h, "max-w-xs rounded-2xl", b.mine ? "rounded-br-md" : "rounded-bl-md")} />
        </div>
      ))}
    </div>
  )
}
