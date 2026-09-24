"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DotsThreeVertical,
  Eye,
  WarningOctagon,
  ListBullets,
  Lock,
  ShieldWarning,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminUserListItem } from "./types"

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

export const userColumns: ColumnDef<AdminUserListItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => {
      const user = row.original
      const displayName = user.businessName || user.name
      const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

      const primaryContact = user.phone || user.email

      return (
        <div className="flex items-center gap-3 min-w-[220px]">
          <Avatar className="size-9 rounded-lg shrink-0 border border-border/60">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className="text-[11px] font-semibold bg-muted text-muted-foreground rounded-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-xs text-foreground truncate">
                {displayName}
              </span>
              {user.reportsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="text-[10px] font-bold px-1.5 py-0 h-4 shrink-0 gap-0.5"
                >
                  <WarningOctagon size={11} weight="fill" />
                  <span>{user.reportsCount} {user.reportsCount === 1 ? "report" : "reports"}</span>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <span className="font-mono text-[10px] text-muted-foreground/80">{user.id}</span>
              {primaryContact && (
                <>
                  <span>·</span>
                  <span className="truncate">{primaryContact}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "accountType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.accountType
      return (
        <Badge
          variant={ACCOUNT_TYPE_VARIANTS[type] || "outline"}
          className="text-[10px] font-medium px-2 py-0.5 h-5"
        >
          {ACCOUNT_TYPE_LABELS[type] || type}
        </Badge>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="text-xs space-y-0.5 min-w-[120px]">
        <span className="text-foreground font-medium block truncate">{row.original.province}</span>
        <span className="text-[10px] text-muted-foreground block truncate">{row.original.location}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "listingsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listings" />
    ),
    cell: ({ row }) => {
      const count = row.original.listingsCount
      return (
        <span className="text-xs font-semibold text-foreground">
          {count}
        </span>
      )
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "verificationStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification" />
    ),
    cell: ({ row }) => {
      const v = row.original.verificationStatus
      const conf = VERIFICATION_CONFIG[v] || { label: v, tone: "neutral" as StatusTone }
      return <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const conf = STATUS_CONFIG[status] || { label: status, tone: "neutral" as StatusTone }
      return <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">{row.original.joinedAt}</span>
    ),
    sortingFn: "datetime",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const isSellerType = user.accountType === "seller" || user.accountType === "business" || user.accountType === "dealer"

      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Account actions"
                >
                  <DotsThreeVertical size={16} weight="bold" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                render={
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <Eye size={14} />
                    <span>View Account</span>
                  </Link>
                }
              />
              {isSellerType && (
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
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full text-amber-600 dark:text-amber-400">
                    <Lock size={14} />
                    <span>Restrict Account</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full text-destructive">
                    <ShieldWarning size={14} />
                    <span>Suspend Account</span>
                  </Link>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableSorting: false,
  },
]
