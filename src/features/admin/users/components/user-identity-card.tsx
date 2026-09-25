"use client"

import Link from "next/link"
import {
  ArrowLeft,
  DotsThreeVertical,
  PencilSimple,
  Lock,
  ShieldWarning,
  CheckCircle,
  ListBullets,
  WarningOctagon,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminUserDetail } from "../types"

interface UserIdentityCardProps {
  user: AdminUserDetail
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

export function UserIdentityCard({ user }: UserIdentityCardProps) {
  const displayName = user.businessName || user.name
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const statusConf = STATUS_CONFIG[user.status] || { label: user.status, tone: "neutral" as StatusTone }
  const verifConf = VERIFICATION_CONFIG[user.verificationStatus] || { label: user.verificationStatus, tone: "neutral" as StatusTone }
  const isSeller = user.accountType === "seller" || user.accountType === "business" || user.accountType === "dealer"

  return (
    <div className="space-y-2">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-11 rounded-xl border border-border/60 shrink-0">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground rounded-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-foreground">{displayName}</h1>
              <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {user.id}
              </span>
              <Badge variant="outline" className="text-[10px] font-medium px-2 py-0 h-5">
                {ACCOUNT_TYPE_LABELS[user.accountType] || user.accountType}
              </Badge>
              <StatusBadge label={verifConf.label} tone={verifConf.tone} size="sm" />
              <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.email} · {user.phone} · {user.province}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-semibold cursor-pointer"
            render={
              <Link href={`/admin/users/${user.id}`} className="flex items-center gap-1.5">
                <PencilSimple size={13} />
                Edit Account
              </Link>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="size-8 cursor-pointer"
                  aria-label="More actions"
                >
                  <DotsThreeVertical size={15} weight="bold" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              {isSeller && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/listings?search=${encodeURIComponent(user.name)}`}
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <ListBullets size={14} />
                      <span>View Listings</span>
                    </Link>
                  }
                />
              )}
              {user.reportsCount > 0 && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/reports?search=${encodeURIComponent(user.name)}`}
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <WarningOctagon size={14} />
                      <span>View Reports ({user.reportsCount})</span>
                    </Link>
                  }
                />
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <button className="flex items-center gap-2 cursor-pointer w-full text-amber-600 dark:text-amber-400">
                    <Lock size={14} />
                    <span>Restrict Account</span>
                  </button>
                }
              />
              {user.status === "suspended" ? (
                <DropdownMenuItem
                  render={
                    <button className="flex items-center gap-2 cursor-pointer w-full text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>Restore Account</span>
                    </button>
                  }
                />
              ) : (
                <DropdownMenuItem
                  render={
                    <button className="flex items-center gap-2 cursor-pointer w-full text-destructive">
                      <ShieldWarning size={14} />
                      <span>Suspend Account</span>
                    </button>
                  }
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
