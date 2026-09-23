"use client"

import { WarningOctagon, LockKey } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReportedChatCase } from "../types"

interface ReportedChatMessagesViewProps {
  chatCase: ReportedChatCase | null
}

export function ReportedChatMessagesView({ chatCase }: ReportedChatMessagesViewProps) {
  if (!chatCase) {
    return (
      <Card className="h-full min-h-[360px] flex items-center justify-center p-6 text-center bg-card border-0 rounded-xl shadow-2xs">
        <p className="text-xs text-muted-foreground">Select a flagged chat case from the queue to inspect messages.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs flex flex-col h-full">
      <CardHeader className="py-2.5 px-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <LockKey size={14} className="text-primary" />
            Report-Linked Conversation Evidence
          </CardTitle>
          <span className="text-[10px] text-muted-foreground block">
            Displaying only report-attached message context adhering to privacy protocols.
          </span>
        </div>

        <Badge variant="outline" className="text-[10px] font-mono">
          {chatCase.messages.length} Messages
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3.5 overflow-y-auto flex-1 bg-muted/5 max-h-[560px]">
        {chatCase.messages.map((msg) => {
          const isBuyer = msg.senderId === chatCase.buyer.id

          return (
            <div
              key={msg.id}
              className={cn(
                "space-y-1 max-w-[85%]",
                isBuyer ? "ml-auto text-right" : "mr-auto text-left"
              )}
            >
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
                <span className="font-semibold text-foreground">{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={cn(
                  "p-3 rounded-xl text-xs leading-relaxed border transition-all",
                  msg.isFlagged
                    ? "bg-destructive/10 border-destructive text-destructive dark:text-rose-300 ring-1 ring-destructive/30"
                    : isBuyer
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground"
                )}
              >
                <p>{msg.text}</p>
              </div>

              {msg.isFlagged && msg.flagReason && (
                <div className="p-2 rounded-md bg-destructive/15 border border-destructive/30 text-[10px] text-destructive flex items-start gap-1.5 text-left">
                  <WarningOctagon size={13} className="shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">Automated Flag:</strong> {msg.flagReason}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
