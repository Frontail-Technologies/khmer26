"use client"

import { Bell, User, Users, CalendarBlank } from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { NotificationRecord } from "../types"

interface NotificationDetailSheetProps {
  notification: NotificationRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AUDIENCE_LABELS: Record<string, string> = {
  all_users: "All Users",
  buyers: "Buyers",
  sellers: "Sellers",
  dealers: "Businesses & Dealers",
  specific_user: "Specific User",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  sent: { label: "Sent", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "destructive" },
}

export function NotificationDetailSheet({
  notification,
  open,
  onOpenChange,
}: NotificationDetailSheetProps) {
  if (!notification) return null

  const statusConf = STATUS_CONFIG[notification.status] || {
    label: notification.status,
    tone: "neutral" as StatusTone,
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[440px] p-4 space-y-4 overflow-y-auto text-xs">
        <SheetHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <Bell size={16} />
              <span>Notification Details</span>
            </div>
            <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground block pt-1">
            {notification.id}
          </span>
        </SheetHeader>

        <div className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Title</span>
            <h4 className="font-bold text-sm text-foreground">{notification.title}</h4>
          </div>

          <div className="pt-2 border-t border-border/40 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Message</span>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users size={13} />
              Target Audience
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Audience</span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {AUDIENCE_LABELS[notification.audience] || notification.audience}
              </Badge>
            </div>
            {notification.targetUser && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono font-medium text-foreground">{notification.targetUser}</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CalendarBlank size={13} />
              Dispatch Details
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sent At</span>
                <span className="text-foreground">{notification.sentAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sent By</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <User size={12} />
                  {notification.sentBy}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
