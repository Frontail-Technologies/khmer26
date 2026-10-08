"use client"

import Link from "next/link"
import Image from "next/image"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, ArrowSquareOut, StopCircle, Sparkle, Star, Lightning } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { ActivePromotionItem, PromotionType } from "./types"

const PROMOTION_TYPE_CONFIG: Record<
  PromotionType,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  featured: {
    label: "Featured Listing",
    icon: Sparkle,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  top_listing: {
    label: "Top Listing Boost",
    icon: Star,
    badgeClass: "bg-accent/10 text-accent border-accent/20",
  },
  urgent: {
    label: "Urgent Badge",
    icon: Lightning,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
}

interface PromotionColumnOptions {
  onViewDetails: (item: ActivePromotionItem) => void
  onEndPromotion: (id: string) => void
}

export function createPromotionColumns({
  onViewDetails,
  onEndPromotion,
}: PromotionColumnOptions): ColumnDef<ActivePromotionItem>[] {
  return [
    {
      accessorKey: "listingTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Listing" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-2.5 min-w-[220px]">
            {item.listingImage && (
              <div className="relative size-9 rounded-md overflow-hidden shrink-0 border border-border/60 bg-muted">
                <Image
                  src={item.listingImage}
                  alt={item.listingTitle}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <Link
                href={`/admin/listings/${item.listingId}`}
                className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
              >
                {item.listingTitle}
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="font-mono text-[10px]">{item.listingId}</span>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  ${typeof item.listingPrice === 'number' ? item.listingPrice.toLocaleString() : (item.listingPrice ?? 0)}
                </span>
              </div>
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
          <div className="space-y-0.5 min-w-[140px]">
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
        <DataTableColumnHeader column={column} title="Promotion" />
      ),
      cell: ({ row }) => {
        const conf = PROMOTION_TYPE_CONFIG[row.original.promotionType] || PROMOTION_TYPE_CONFIG.featured
        const Icon = conf.icon
        return (
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold px-2 py-0.5 h-5 flex items-center gap-1 w-fit ${conf.badgeClass}`}
          >
            <Icon size={12} weight="fill" />
            <span>{conf.label}</span>
          </Badge>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "startedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Period" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            <span>{item.startedAt}</span>
            <span className="mx-1 text-muted-foreground/60">→</span>
            <span className="text-foreground font-medium">{item.expiresAt}</span>
          </div>
        )
      },
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
        const item = row.original
        return (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label="View promotion details"
              onClick={() => onViewDetails(item)}
            >
              <Eye size={14} />
            </Button>
            <Link
              href={`/admin/listings/${item.listingId}`}
              className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              aria-label="View listing"
            >
              <ArrowSquareOut size={13} />
            </Link>
            {item.status === "active" && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-7 text-destructive hover:bg-destructive/10"
                aria-label="End promotion"
                onClick={() => onEndPromotion(item.id)}
              >
                <StopCircle size={13} />
              </Button>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
