"use client"

import Link from "next/link"
import {
  User,
  Storefront,
  ShoppingBag,
  ArrowSquareOut,
  ShieldWarning,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { ReportedChatCase } from "../types"

interface ReportedChatCasePanelProps {
  chatCase: ReportedChatCase | null
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  open: { label: "Open Case", tone: "destructive" },
  in_review: { label: "In Review", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
}

export function ReportedChatCasePanel({ chatCase }: ReportedChatCasePanelProps) {
  if (!chatCase) return null

  const sConf = STATUS_CONFIG[chatCase.status] || { label: chatCase.status, tone: "neutral" as StatusTone }

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs text-xs">
      <CardHeader className="py-2.5 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Incident Telemetry
        </CardTitle>
        <StatusBadge label={sConf.label} tone={sConf.tone} size="sm" />
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Linked Safety Report</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-foreground">{chatCase.reportId}</span>
            <Button
              variant="outline"
              size="xs"
              render={
                <Link href={`/admin/reports/${chatCase.reportId}`}>
                  <ArrowSquareOut size={12} className="mr-1" />
                  Open Case
                </Link>
              }
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border-0 space-y-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <User size={12} />
            Buyer (Reporting User)
          </span>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <Link
                href={`/admin/users/${chatCase.buyer.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
              >
                {chatCase.buyer.name}
              </Link>
              <span className="text-[10px] text-muted-foreground block">{chatCase.buyer.phone}</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{chatCase.buyer.id}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border-0 space-y-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Storefront size={12} />
            Seller (Reported User)
          </span>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <Link
                href={`/admin/users/${chatCase.seller.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
              >
                {chatCase.seller.businessName || chatCase.seller.name}
              </Link>
              <span className="text-[10px] text-muted-foreground block">{chatCase.seller.phone}</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{chatCase.seller.id}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <ShoppingBag size={12} />
              Linked Listing
            </span>
            <Button
              variant="ghost"
              size="xs"
              render={
                <Link href={`/admin/listings/${chatCase.listing.id}`}>
                  <ArrowSquareOut size={12} />
                </Link>
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground truncate">{chatCase.listing.title}</span>
            <span className="font-bold text-foreground shrink-0 ml-1.5">${chatCase.listing.price}</span>
          </div>
        </div>

        {chatCase.assignedModerator && (
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
            <span className="text-muted-foreground">Assigned Moderator</span>
            <span className="font-semibold text-foreground">{chatCase.assignedModerator}</span>
          </div>
        )}

        <div className="pt-2 space-y-2 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-destructive hover:text-destructive"
            render={
              <Link href={`/admin/users/${chatCase.seller.id}`}>
                <ShieldWarning size={14} className="mr-1.5 text-destructive" />
                Restrict Reported User
              </Link>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
