import Link from "next/link"
import { ChatCircleDots, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DEMO_REPORTED_CHATS } from "@/features/admin/reported-chats/data/demo-reported-chats"

export function AdminReportedChatsCard() {
  const recentChats = DEMO_REPORTED_CHATS.slice(0, 4)

  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Reported Messages
          </CardTitle>
          <Badge variant="secondary" className="h-4.5 px-2 text-[9px] font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
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
        {recentChats.map((c) => (
          <div
            key={c.id}
            className="p-3.5 sm:p-4 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ChatCircleDots size={16} weight="bold" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-foreground truncate">
                    {c.participantA.name} <span className="text-muted-foreground font-normal">↔</span> {c.participantB.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 font-medium h-4 rounded border-destructive/30 text-destructive bg-destructive/5"
                  >
                    {c.reason}
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground truncate italic">
                  &ldquo;{c.reportedMessageText}&rdquo;
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-muted-foreground block font-medium">
                {c.createdAt.split(",")[0] || "Recent"}
              </span>
              <Link
                href="/admin/reported-chats"
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
