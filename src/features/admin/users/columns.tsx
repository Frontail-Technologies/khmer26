"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DotsThreeVertical,
  Eye,
  PencilSimple,
  WarningOctagon,
  ListBullets,
  Lock,
  ShieldWarning,
  CheckCircle,
  Phone,
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
      const contact = user.phone || user.email

      return (
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar className="size-8 rounded-lg shrink-0 border border-border/60">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground rounded-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-foreground truncate max-w-[160px]">
                {displayName}
              </span>
              {user.reportsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="text-[9px] font-bold px-1 py-0 h-3.5 shrink-0 gap-0.5"
                >
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
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "accountType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 h-5 whitespace-nowrap">
        {ACCOUNT_TYPE_LABELS[row.original.accountType] || row.original.accountType}
      </Badge>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-foreground whitespace-nowrap">{row.original.province}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "listingsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listings" />
    ),
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-foreground tabular-nums">
        {row.original.listingsCount}
      </span>
    ),
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
      const s = row.original.status
      const conf = STATUS_CONFIG[s] || { label: s, tone: "neutral" as StatusTone }
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
      const isSeller = user.accountType === "seller" || user.accountType === "business" || user.accountType === "dealer"
      const isActive = user.status === "active"

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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <Eye size={14} />
                    <span>View Account</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <PencilSimple size={14} />
                    <span>Edit Account</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <Phone size={14} />
                    <span>Edit Contact Info</span>
                  </Link>
                }
              />
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
              {isActive && (
                <DropdownMenuItem
                  render={
                    <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full text-amber-600 dark:text-amber-400">
                      <Lock size={14} />
                      <span>Restrict Account</span>
                    </Link>
                  }
                />
              )}
              {user.status === "suspended" ? (
                <DropdownMenuItem
                  render={
                    <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>Restore Account</span>
                    </Link>
                  }
                />
              ) : (
                <DropdownMenuItem
                  render={
                    <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 cursor-pointer w-full text-destructive">
                      <ShieldWarning size={14} />
                      <span>Suspend Account</span>
                    </Link>
                  }
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableSorting: false,
  },
]
