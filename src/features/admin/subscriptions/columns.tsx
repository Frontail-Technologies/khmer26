"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DotsThreeVertical, Eye, Storefront } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { SubscriberRecord } from "./types"

const PLAN_BADGES: Record<string, { label: string; badgeClass: string }> = {
  free: { label: "Free Plan", badgeClass: "bg-muted text-muted-foreground border-border/80" },
  seller_plus: { label: "Seller Plus", badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  business: { label: "Business Pro", badgeClass: "bg-primary/10 text-primary border-primary/20" },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
  paused: { label: "Paused", tone: "warning" },
}

export const subscriberColumns: ColumnDef<SubscriberRecord>[] = [
  {
    accessorKey: "sellerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seller" />
    ),
    cell: ({ row }) => {
      const sub = row.original
      return (
        <div className="space-y-0.5 min-w-[180px]">
          <Link
            href={`/admin/users/${sub.sellerId}`}
            className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
          >
            {sub.businessName || sub.sellerName}
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-mono text-[10px]">{sub.sellerId}</span>
            {sub.businessName && <span>• {sub.sellerName}</span>}
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "planName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => {
      const sub = row.original
      const planConfig = PLAN_BADGES[sub.planTier] || {
        label: sub.planName,
        badgeClass: "bg-muted text-muted-foreground border-border/80",
      }
      return (
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold px-2 py-0.5 h-5 ${planConfig.badgeClass}`}
        >
          {planConfig.label}
        </Badge>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "listingUsage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing Usage" />
    ),
    cell: ({ row }) => {
      const usage = row.original.listingUsage
      const pct = Math.round((usage.used / usage.limit) * 100)
      return (
        <div className="space-y-1 min-w-[120px]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-foreground">
              {usage.used} / {usage.limit}
            </span>
            <span className="text-muted-foreground text-[10px]">{pct}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">{row.original.expiresAt}</span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const conf = STATUS_CONFIG[row.original.status] || {
        label: row.original.status,
        tone: "neutral" as StatusTone,
      }
      return <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
    },
    sortingFn: "alphanumeric",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sub = row.original
      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Subscription actions"
                >
                  <DotsThreeVertical size={16} weight="bold" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuItem
                render={
                  <Link
                    href={`/admin/users/${sub.sellerId}`}
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <Eye size={13} />
                    <span>View Account</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link
                    href={`/admin/listings?search=${encodeURIComponent(sub.sellerName)}`}
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <Storefront size={13} />
                    <span>View Listings</span>
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
