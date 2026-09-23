"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DotsThreeVertical, Eye, ArrowSquareOut } from "@phosphor-icons/react"
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
import type { ActivePromotionItem } from "./types"

const PROMOTION_TYPE_LABELS: Record<string, string> = {
  featured: "Homepage Featured",
  top_category: "Top Category",
  urgent: "Urgent Badge",
  daily_bump: "Daily Bump",
}

const PROMOTION_TYPE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  featured: "default",
  top_category: "secondary",
  urgent: "destructive" as "default",
  daily_bump: "outline",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
  scheduled: { label: "Scheduled", tone: "info" },
  cancelled: { label: "Cancelled", tone: "destructive" },
}

export const promotionColumns: ColumnDef<ActivePromotionItem>[] = [
  {
    accessorKey: "listingTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing" />
    ),
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="space-y-0.5 min-w-[200px]">
          <Link
            href={`/admin/listings/${item.listingId}`}
            className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
          >
            {item.listingTitle}
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-mono text-[10px]">{item.listingId}</span>
            <span>•</span>
            <span className="font-semibold text-foreground">${item.listingPrice.toLocaleString()}</span>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "sellerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seller" />
    ),
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="space-y-0.5">
          <Link
            href={`/admin/users/${item.sellerId}`}
            className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
          >
            {item.sellerName}
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground block">{item.sellerId}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "promotionType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Promotion Tier" />
    ),
    cell: ({ row }) => {
      const type = row.original.promotionType
      return (
        <Badge
          variant={PROMOTION_TYPE_VARIANTS[type] || "outline"}
          className="text-[10px] font-semibold px-1.5 py-0 h-4.5"
        >
          {PROMOTION_TYPE_LABELS[type] || type}
        </Badge>
      )
    },
    sortingFn: "alphanumeric",
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
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.expiresAt}</span>
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
    accessorKey: "paymentReference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Ref" />
    ),
    cell: ({ row }) => {
      const ref = row.original.paymentReference
      if (ref) {
        return (
          <Link
            href={`/admin/payments?search=${ref}`}
            className="font-mono text-[11px] text-primary hover:underline"
          >
            {ref}
          </Link>
        )
      }
      return <span className="text-muted-foreground text-xs">—</span>
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Promotion actions"
                >
                  <DotsThreeVertical size={16} weight="bold" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40 text-xs">
              <DropdownMenuItem
                render={
                  <Link href={`/admin/listings/${item.listingId}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <ArrowSquareOut size={13} />
                    <span>View Listing</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link href={`/admin/users/${item.sellerId}`} className="flex items-center gap-2 cursor-pointer w-full">
                    <Eye size={13} />
                    <span>View Seller</span>
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
