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
  seller: "Individual Seller",
  business: "Business",
  dealer: "Dealer",
}

const ACCOUNT_TYPE_VARIANTS: Record<string, "secondary" | "outline" | "default"> = {
  buyer: "outline",
  seller: "secondary",
  business: "default",
  dealer: "default",
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
        <p className="text-xs text-muted-foreground">No accounts match your filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {data.map((user) => {
        const displayName = user.businessName || user.name
        const initials = displayName
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()

        const primaryContact = user.phone || user.email
        const statusConf = STATUS_CONFIG[user.status] || { label: user.status, tone: "neutral" as StatusTone }
        const verifConf = VERIFICATION_CONFIG[user.verificationStatus] || { label: user.verificationStatus, tone: "neutral" as StatusTone }

        return (
          <Link
            key={user.id}
            href={`/admin/users/${user.id}`}
            className="block group"
          >
            <Card className="p-3.5 bg-card shadow-2xs rounded-xl hover:bg-muted/20 transition-colors border-0">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="size-9 rounded-lg shrink-0 border border-border/60">
                    <AvatarImage src={user.avatarUrl} alt={displayName} />
                    <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-xs text-foreground block truncate group-hover:text-primary transition-colors">
                        {displayName}
                      </span>
                      {user.reportsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] font-bold px-1.5 py-0 h-4 shrink-0 gap-0.5"
                        >
                          <WarningOctagon size={11} weight="fill" />
                          <span>{user.reportsCount}</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                      <span className="font-mono text-[10px]">{user.id}</span>
                      {primaryContact && (
                        <>
                          <span>·</span>
                          <span className="truncate">{primaryContact}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                  <CaretRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2.5 border-t border-border/40">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Account Type</span>
                  <Badge
                    variant={ACCOUNT_TYPE_VARIANTS[user.accountType] || "outline"}
                    className="text-[10px] font-medium mt-0.5 px-1.5 py-0 h-4.5"
                  >
                    {ACCOUNT_TYPE_LABELS[user.accountType] || user.accountType}
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px]">Verification</span>
                  <div className="mt-0.5">
                    <StatusBadge label={verifConf.label} tone={verifConf.tone} size="sm" />
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px]">Location</span>
                  <span className="font-medium text-foreground truncate block mt-0.5">
                    {user.province}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px]">Listings</span>
                  <span className="font-medium text-foreground block mt-0.5">
                    {user.listingsCount} {user.listingsCount === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
