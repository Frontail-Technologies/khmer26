"use client"

import { WarningOctagon } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import type { ReportedChatCase } from "../types"

interface ReportedChatListItemProps {
  chatCase: ReportedChatCase
  isSelected: boolean
  onSelect: () => void
}

const PRIORITY_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  critical: { label: "Critical Risk", tone: "destructive" },
  high: { label: "High Risk", tone: "warning" },
  medium: { label: "Medium", tone: "info" },
  low: { label: "Low", tone: "neutral" },
}

export function ReportedChatListItem({
  chatCase,
  isSelected,
  onSelect,
}: ReportedChatListItemProps) {
  const pConf = PRIORITY_CONFIG[chatCase.priority] || { label: chatCase.priority, tone: "neutral" as StatusTone }

  const flaggedCount = chatCase.messages.filter((m) => m.isFlagged).length

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "p-3 cursor-pointer transition-all rounded-xl text-left border-0",
        isSelected
          ? "bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/30"
          : "bg-card shadow-2xs hover:bg-muted/20"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono font-bold text-xs text-foreground">{chatCase.id}</span>
            <span className="text-[10px] text-muted-foreground font-mono">({chatCase.reportId})</span>
          </div>
          <span className="font-semibold text-xs text-foreground block truncate">
            {chatCase.buyer.name} ↔ {chatCase.seller.businessName || chatCase.seller.name}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <StatusBadge label={pConf.label} tone={pConf.tone} size="sm" />
        </div>
      </div>

      <p className="text-xs text-foreground line-clamp-2 leading-relaxed mb-2.5">
        {chatCase.reportedReason}
      </p>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <span>{chatCase.createdAt}</span>
          <span className="truncate max-w-[120px]">Listing: {chatCase.listing.title}</span>
        </div>

        {flaggedCount > 0 && (
          <Badge variant="destructive" className="text-[9px] font-bold px-1 py-0 h-4">
            <WarningOctagon size={10} className="mr-0.5" />
            {flaggedCount} Flagged
          </Badge>
        )}
      </div>
    </Card>
  )
}
