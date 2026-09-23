"use client"

import {
  ClockCounterClockwise,
  User,
  Globe,
  Terminal,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminAuditEntry } from "../types"

interface AuditDetailSheetProps {
  entry: AdminAuditEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  success: { label: "Execution Successful", tone: "success" },
  warning: { label: "Warning Issued", tone: "warning" },
  failure: { label: "Action Failed", tone: "destructive" },
}

export function AuditDetailSheet({
  entry,
  open,
  onOpenChange,
}: AuditDetailSheetProps) {
  if (!entry) return null

  const conf = STATUS_CONFIG[entry.status] || { label: entry.status, tone: "neutral" as StatusTone }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[460px] p-4 space-y-4 overflow-y-auto text-xs">
        <SheetHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <ClockCounterClockwise size={16} />
              <span>Immutable Audit Record</span>
            </div>
            <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground block pt-1">
            Log ID: {entry.id} • {entry.timestamp}
          </span>
        </SheetHeader>

        <div className="p-3.5 rounded-xl bg-card border border-border space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Action Executed</span>
            <span className="font-bold text-foreground">{entry.action}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border/40">
            <span className="text-muted-foreground">Target Entity</span>
            <span className="font-semibold text-foreground truncate max-w-[220px]">
              {entry.targetName} ({entry.targetId})
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border/40">
            <span className="text-muted-foreground">System Module</span>
            <Badge variant="outline" className="text-[10px] uppercase font-bold">
              {entry.module}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} />
              Staff Actor Signature
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{entry.actorName}</span>
                <span className="font-mono text-muted-foreground">{entry.actorId}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Assigned RBAC Role</span>
                <span className="font-medium text-foreground uppercase">{entry.actorRole}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={13} />
              Network & Session Telemetry
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Origin IP</span>
                <span className="font-mono font-medium text-foreground">{entry.ipAddress}</span>
              </div>
              {entry.userAgent && (
                <div className="pt-1">
                  <span className="text-[10px] text-muted-foreground block">User Agent</span>
                  <span className="font-mono text-[10px] text-muted-foreground block truncate">
                    {entry.userAgent}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Terminal size={13} />
              Structured Event Payload (JSON)
            </span>
            <pre className="p-2.5 rounded bg-muted/50 border border-border/50 text-[10px] font-mono overflow-x-auto text-foreground leading-relaxed max-h-[180px]">
              {JSON.stringify(entry.metadata, null, 2)}
            </pre>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
