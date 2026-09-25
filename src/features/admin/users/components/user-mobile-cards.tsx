"use client"

import Link from "next/link"
import { CaretRight, WarningOctagon } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminUserListItem } from "../types"

interface UserMobileCardsProps {
  data: AdminUserListItem[]
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  buyer: "Buyer",
  seller: "Seller",
  business: "Business",
  dealer: "Dealer",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  suspended: { label: "Suspended", tone: "destructive" },
  restricted: { label: "Restricted", tone: "warning" },
}

const VERIFICATION_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  verified: { label: "Verified", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  unverified: { label: "Unverified", tone: "neutral" },
}

export function UserMobileCards({ data }: UserMobileCardsProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-xl shadow-2xs">
        <p className="text-xs text-muted-foreground">No accounts match your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((user) => {
        const displayName = user.businessName || user.name
        const initials = displayName
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
        const contact = user.phone || user.email
        const statusConf = STATUS_CONFIG[user.status] || { label: user.status, tone: "neutral" as StatusTone }
        const verifConf = VERIFICATION_CONFIG[user.verificationStatus] || { label: user.verificationStatus, tone: "neutral" as StatusTone }
        const isSeller = user.accountType === "seller" || user.accountType === "business" || user.accountType === "dealer"

        return (
          <Link key={user.id} href={`/admin/users/${user.id}`} className="block group">
            <Card className="px-3.5 py-3 bg-card shadow-2xs rounded-xl hover:bg-muted/20 transition-colors border-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="size-8 rounded-lg shrink-0 border border-border/60">
                    <AvatarImage src={user.avatarUrl} alt={displayName} />
                    <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                        {displayName}
                      </span>
                      {user.reportsCount > 0 && (
                        <Badge variant="destructive" className="text-[9px] px-1 py-0 h-3.5 shrink-0 gap-0.5">
                          <WarningOctagon size={9} weight="fill" />
                          {user.reportsCount}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate block">
                      <span className="font-mono text-[10px]">{user.id}</span>
                      {contact && <span className="ml-1">· {contact}</span>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                  <CaretRight size={13} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border/40 flex-wrap">
                <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4.5">
                  {ACCOUNT_TYPE_LABELS[user.accountType] || user.accountType}
                </Badge>
                <StatusBadge label={verifConf.label} tone={verifConf.tone} size="sm" />
                <span className="text-[11px] text-muted-foreground ml-auto">{user.province}</span>
                {isSeller && (
                  <span className="text-[11px] text-muted-foreground">{user.listingsCount} listings</span>
                )}
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
