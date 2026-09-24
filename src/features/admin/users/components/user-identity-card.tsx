"use client"

import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminUserDetail } from "../types"

interface UserIdentityCardProps {
  user: AdminUserDetail
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

export function UserIdentityCard({ user }: UserIdentityCardProps) {
  const displayName = user.businessName || user.name
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const conf = STATUS_CONFIG[user.status] || { label: user.status, tone: "neutral" as StatusTone }
  const verifConf = VERIFICATION_CONFIG[user.verificationStatus] || { label: user.verificationStatus, tone: "neutral" as StatusTone }

  return (
    <div className="space-y-3">
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/admin/users" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
              <ArrowLeft size={14} />
              <span>Users & Sellers</span>
            </Link>
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card shadow-2xs border-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar className="size-12 rounded-xl border border-border/60 shrink-0">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground rounded-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-foreground truncate">{displayName}</h1>
              <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {user.id}
              </span>
              <Badge
                variant={ACCOUNT_TYPE_VARIANTS[user.accountType] || "outline"}
                className="text-[10px] font-medium px-2 py-0.5 h-5"
              >
                {ACCOUNT_TYPE_LABELS[user.accountType] || user.accountType}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>{user.email}</span>
              <span>·</span>
              <span>{user.phone}</span>
              <span>·</span>
              <span>{user.province}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge label={verifConf.label} tone={verifConf.tone} />
          <StatusBadge label={conf.label} tone={conf.tone} />
        </div>
      </div>
    </div>
  )
}
