"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DotsThreeVertical, Eye, CheckCircle, WarningCircle } from "@phosphor-icons/react"
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

export const userColumns: ColumnDef<AdminUserListItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User / Seller" />
    ),
    cell: ({ row }) => {
      const user = row.original
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

      return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <Avatar className="size-8 rounded-md shrink-0 border border-border/60">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-[11px] font-semibold bg-muted text-muted-foreground rounded-md">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 min-w-0">
            <span className="font-semibold text-xs text-foreground block truncate">
              {user.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <span className="font-mono text-[10px] text-muted-foreground/80">{user.id}</span>
              <span>•</span>
              <span className="truncate">{user.phone}</span>
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
          className="text-[10px] font-medium px-1.5 py-0 h-4.5"
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
      <div className="text-xs space-y-0.5">
        <span className="text-foreground block truncate">{row.original.province}</span>
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
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-foreground">
        {row.original.listingsCount}
      </span>
    ),
    sortingFn: "basic",
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.joinedAt}</span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "verificationStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification" />
    ),
    cell: ({ row }) => {
      const v = row.original.verificationStatus
      if (v === "verified") {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={13} weight="fill" />
            Verified
          </span>
        )
      }
      if (v === "pending") {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            <WarningCircle size={13} weight="fill" />
            Pending
          </span>
        )
      }
      return <span className="text-[11px] text-muted-foreground">Unverified</span>
    },
    enableSorting: false,
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
    accessorKey: "reportsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reports" />
    ),
    cell: ({ row }) => {
      const count = row.original.reportsCount
      if (count > 0) {
        return (
          <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0 h-4.5">
            {count}
          </Badge>
        )
      }
      return <span className="text-xs text-muted-foreground/60">0</span>
    },
    sortingFn: "basic",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="User actions"
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
                    <span>View Details</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href={`/admin/listings?search=${encodeURIComponent(user.name)}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <span>View Listings</span>
                  </Link>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <span>Restrict Account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableSorting: false,
  },
]
