"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle, WarningCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminUserDetail } from "../types"

interface UserIdentityCardProps {
  user: AdminUserDetail
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  buyer: "Individual Buyer",
  seller: "Individual Seller",
  business: "Business Merchant",
  dealer: "Verified Dealership",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  suspended: { label: "Suspended", tone: "destructive" },
  restricted: { label: "Restricted", tone: "warning" },
}

export function UserIdentityCard({ user }: UserIdentityCardProps) {
  const initials = user.name
  .split(" ")
  .map((n) => n[0])
  .slice(0, 2)
  .join("")
  .toUpperCase()

  const conf = STATUS_CONFIG[user.status] || { label: user.status, tone: "neutral" as StatusTone }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/admin/users" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft size={14} />
              <span>Back to Users</span>
            </Link>
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-12 rounded-lg border border-border shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground rounded-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-foreground truncate">{user.name}</h1>
              <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {user.id}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>{ACCOUNT_TYPE_LABELS[user.accountType] || user.accountType}</span>
              <span>•</span>
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user.verificationStatus === "verified" ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle size={14} weight="fill" />
              Verified
            </span>
          ) : user.verificationStatus === "pending" ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <WarningCircle size={14} weight="fill" />
              Pending Verification
            </span>
          ) : (
            <Badge variant="outline" className="text-xs">
              Unverified
            </Badge>
          )}
          <StatusBadge label={conf.label} tone={conf.tone} />
        </div>
      </div>
    </div>
  )
}
