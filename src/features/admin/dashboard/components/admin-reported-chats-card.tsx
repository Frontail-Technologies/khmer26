"use client"

import Link from "next/link"
import { ArrowRight, ChatCircleDots } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminDashboard } from "../hooks/dashboard.queries"
import { normalizeChatReport } from "@/features/admin/reported-chats/api/chat-reports.api"

export function AdminReportedChatsCard() {
  const { data } = useAdminDashboard()
  const recentChats = (data?.recentOpenChatReports ?? []).map((row) =>
    normalizeChatReport({
      report: {
        id: row.report.id,
        reporterUserId: row.report.reporterUserId,
        conversationId: row.report.conversationId,
        messageId: null,
        reasonId: row.reason?.id ?? "",
        details: row.report.details,
        status: row.report.status,
        resolvedAt: null,
        createdAt: row.report.createdAt,
      },
      reason: row.reason,
    })
  )

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Reported Messages
          </CardTitle>
          <Badge variant="secondary" className="h-4.5 px-2 text-[9px] font-bold rounded-md bg-accent/10 text-accent border-accent/20">
            {recentChats.length} In Review
          </Badge>
        </div>

        <Link
          href="/admin/reported-chats"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Chat Queue</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60 flex-1">
        {recentChats.map((chat) => (
          <div
            key={chat.id}
            className="p-3.5 sm:p-4 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-accent/10 text-accent">
                <ChatCircleDots size={16} weight="bold" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-foreground truncate">
                    {chat.participantA.name} <span className="text-muted-foreground font-normal">to</span> {chat.participantB.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 font-medium h-4 rounded border-destructive/30 text-destructive bg-destructive/5"
                  >
                    {chat.reason}
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground truncate italic">
                  &ldquo;{chat.reportedMessageText}&rdquo;
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-muted-foreground block font-medium">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(chat.createdAt))}
              </span>
              <Link
                href={`/admin/reported-chats?search=${encodeURIComponent(chat.id)}`}
                className="text-xs font-bold text-primary hover:underline mt-0.5 inline-block"
              >
                View Thread
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
