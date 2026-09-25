"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  WarningCircle,
  User,
  Storefront,
  CalendarBlank,
  Chats,
  CheckCircle,
  XCircle,
  ArrowSquareOut,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { ReportedChatRecord } from "../types"
import { cn } from "@/lib/utils"

interface ReportedChatDetailSheetProps {
  report: ReportedChatRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, newStatus: "resolved" | "dismissed") => void
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  open: { label: "Open", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
}

export function ReportedChatDetailSheet({
  report,
  open,
  onOpenChange,
  onStatusChange,
}: ReportedChatDetailSheetProps) {
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false)

  if (!report) return null

  const statusConf = STATUS_CONFIG[report.status] || {
    label: report.status,
    tone: "neutral" as StatusTone,
  }

  const handleConfirmResolve = () => {
    onStatusChange(report.id, "resolved")
    setResolveDialogOpen(false)
    onOpenChange(false)
  }

  const handleConfirmDismiss = () => {
    onStatusChange(report.id, "dismissed")
    setDismissDialogOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[360px] sm:w-[540px] md:w-[620px] p-4 space-y-4 overflow-y-auto text-xs">
          <SheetHeader className="pb-2 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                <WarningCircle size={16} className="text-destructive" weight="fill" />
                <span>Reported Chat Review</span>
              </div>
              <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground block pt-1">
              Report ID: {report.id} • Conversation: {report.conversationId}
            </span>
          </SheetHeader>

          <div className="p-3.5 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                Violation Reason
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold border-destructive/30 text-destructive">
                {report.reason}
              </Badge>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Reported Message:</span>
              <p className="text-xs font-semibold text-foreground leading-relaxed bg-background/80 p-2.5 rounded-lg border border-destructive/20">
                &quot;{report.reportedMessageText}&quot;
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              Conversation Context
            </span>
            <div className="p-3 rounded-xl bg-muted/20 border border-border/70 space-y-2.5 max-h-[260px] overflow-y-auto">
              {report.messages.map((msg) => {
                const isReportedUser = msg.senderId === report.reportedUserId

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      isReportedUser ? "mr-auto items-start" : "ml-auto items-end"
                    )}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1 pb-0.5">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.createdAt}</span>
                    </div>

                    <div
                      className={cn(
                        "p-2.5 rounded-lg text-xs leading-relaxed shadow-2xs space-y-1",
                        msg.isReported
                          ? "bg-destructive/15 border-2 border-destructive text-foreground font-medium"
                          : isReportedUser
                          ? "bg-background border border-border text-foreground"
                          : "bg-primary/15 border border-primary/20 text-foreground"
                      )}
                    >
                      <p>{msg.text}</p>
                      {msg.isReported && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-destructive pt-0.5">
                          <WarningCircle size={10} weight="fill" />
                          <span>Flagged by Reporter</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} />
                Participant Summary
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Reporter</span>
                  <span className="font-semibold text-foreground block truncate">{report.reporterName}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">{report.reporterId}</span>
                </div>
                <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 space-y-1">
                  <span className="text-[10px] font-bold text-destructive block">Reported User</span>
                  <span className="font-semibold text-foreground block truncate">{report.reportedUserName}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">{report.reportedUserId}</span>
                </div>
              </div>
            </div>

            {report.listing && (
              <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Storefront size={13} />
                  Linked Listing
                </span>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {report.listing.imageUrl && (
                      <div className="relative size-9 rounded overflow-hidden shrink-0 border border-border/60 bg-muted">
                        <Image
                          src={report.listing.imageUrl}
                          alt={report.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-foreground block truncate">
                        {report.listing.title}
                      </span>
                      <span className="font-bold text-[11px] text-primary">
                        ${report.listing.price.toLocaleString()} {report.listing.currency}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-xs text-primary shrink-0"
                    render={
                      <Link href={`/admin/listings/${report.listing.id}`}>
                        <ArrowSquareOut size={12} className="mr-1" />
                        View
                      </Link>
                    }
                  />
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-background border border-border/70 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CalendarBlank size={13} />
                  Reported Date
                </span>
                <span className="font-medium text-foreground">{report.createdAt}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  render={
                    <Link href={`/admin/chats?user=${report.reportedUserId}&conversation=${report.conversationId}`}>
                      <Chats size={13} className="mr-1" />
                      View Full Chat
                    </Link>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  render={
                    <Link href={`/admin/users/${report.reportedUserId}`}>
                      <User size={13} className="mr-1" />
                      User Profile
                    </Link>
                  }
                />
              </div>

              {report.status === "open" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDismissDialogOpen(true)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <XCircle size={14} className="mr-1" />
                    Dismiss Report
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setResolveDialogOpen(true)}
                    className="text-xs bg-primary text-primary-foreground font-semibold"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Resolve Report
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Resolve Reported Chat</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to mark report <span className="font-mono font-semibold text-foreground">{report.id}</span> as resolved?
          </p>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResolveDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmResolve}
              className="text-xs bg-primary text-primary-foreground font-semibold"
            >
              Confirm Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dismissDialogOpen} onOpenChange={setDismissDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Dismiss Reported Chat</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to dismiss report <span className="font-mono font-semibold text-foreground">{report.id}</span> without taking action?
          </p>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDismissDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleConfirmDismiss}
              className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              Confirm Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
