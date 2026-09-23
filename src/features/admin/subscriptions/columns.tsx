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

const PLAN_BADGES: Record<string, "default" | "secondary" | "outline"> = {
  free: "outline",
  pro: "secondary",
  business: "default",
  enterprise: "default",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  past_due: { label: "Past Due", tone: "warning" },
  canceled: { label: "Canceled", tone: "destructive" },
  trialing: { label: "Trialing", tone: "info" },
}

export const subscriberColumns: ColumnDef<SubscriberRecord>[] = [
  {
    accessorKey: "sellerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seller / Business" />
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
      <DataTableColumnHeader column={column} title="Plan Tier" />
    ),
    cell: ({ row }) => {
      const sub = row.original
      return (
        <Badge
          variant={PLAN_BADGES[sub.planTier] || "outline"}
          className="text-[10px] font-semibold px-1.5 py-0 h-4.5"
        >
          {sub.planName}
        </Badge>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "listingUsage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listings Usage" />
    ),
    cell: ({ row }) => {
      const usage = row.original.listingUsage
      const pct = Math.round((usage.used / usage.limit) * 100)
      return (
        <div className="space-y-1 min-w-[100px]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-foreground">
              {usage.used} / {usage.limit}
            </span>
            <span className="text-muted-foreground">{pct}%</span>
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
    accessorKey: "startedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.startedAt}</span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "renewsAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Renewal" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.renewsAt}</span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const conf = STATUS_CONFIG[row.original.status] || { label: row.original.status, tone: "neutral" as StatusTone }
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
                  <Link href={`/admin/users/${sub.sellerId}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <Eye size={13} />
                    <span>View Account</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href={`/admin/listings?search=${encodeURIComponent(sub.sellerName)}`} className="flex items-center gap-2 cursor-pointer w-full">
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
