"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Eye,
  PencilSimple,
  Trash,
  WarningOctagon,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export function createUserColumns(onDelete?: (user: AdminUserListItem) => void): ColumnDef<AdminUserListItem>[] {
  return [
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
              {contact || ACCOUNT_TYPE_LABELS[user.accountType] || user.accountType}
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

      return (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/users/${user.id}`}
            className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="View account"
          >
            <Eye size={14} />
          </Link>
          <Link
            href={`/admin/users/${user.id}?edit=1`}
            className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="Edit account"
          >
            <PencilSimple size={13} />
          </Link>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-7 text-destructive hover:bg-destructive/10"
              aria-label="Delete account"
              onClick={() => onDelete(user)}
            >
              <Trash size={13} />
            </Button>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  ]
}
