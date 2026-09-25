"use client"

import {
  ClockCounterClockwise,
  User,
  ShieldCheck,
  Tag,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import type { AdminAuditEntry, AuditModule } from "../types"

interface AuditDetailSheetProps {
  entry: AdminAuditEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MODULE_LABELS: Record<AuditModule, string> = {
  listings: "Listings",
  verifications: "Verifications",
  reports: "Reports",
  users: "Users",
  payments: "Payments",
  content: "Content",
  settings: "Settings",
  roles: "Roles",
}

export function AuditDetailSheet({
  entry,
  open,
  onOpenChange,
}: AuditDetailSheetProps) {
  if (!entry) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-4 border-b border-border/60 bg-muted/20 space-y-1">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-bold text-foreground">
              Audit Event Details
            </SheetTitle>
            <span className="font-mono text-[11px] text-muted-foreground">{entry.id}</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{entry.timestamp}</span>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ClockCounterClockwise size={13} />
              Action Taken
            </span>
            <p className="font-semibold text-xs text-foreground leading-relaxed">
              {entry.action}
            </p>
            {entry.details && (
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                {entry.details}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User size={13} />
              Admin Staff
            </span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground">
                {entry.actorName}
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {entry.actorRole}
              </Badge>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag size={13} />
              Module & Scope
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Admin Domain:</span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {MODULE_LABELS[entry.module] || entry.module}
              </Badge>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background border border-border/70 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Target Entity
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Entity Name:</span>
                <span className="font-semibold text-xs text-foreground text-right truncate max-w-[200px]">
                  {entry.targetName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Entity Type:</span>
                <span className="text-xs text-foreground">{entry.targetType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Identifier:</span>
                <span className="font-mono text-xs text-foreground">{entry.targetId}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
