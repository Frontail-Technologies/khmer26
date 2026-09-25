"use client"

import Link from "next/link"
import Image from "next/image"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DotsThreeVertical,
  Eye,
  EyeSlash,
  ArrowCounterClockwise,
  User,
  Storefront,
  ArrowSquareOut,
  Star,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/shared/status-badge"
import type { AdminReview } from "./types"

interface ReviewColumnOptions {
  onViewDetails: (review: AdminReview) => void
  onRequestHide: (review: AdminReview) => void
  onRestore: (id: string) => void
}

export function createReviewColumns({
  onViewDetails,
  onRequestHide,
  onRestore,
}: ReviewColumnOptions): ColumnDef<AdminReview>[] {
  return [
    {
      accessorKey: "comment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Review" />
      ),
      cell: ({ row }) => {
        const rev = row.original
        return (
          <div className="space-y-1 min-w-[220px] max-w-[320px]">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  weight="fill"
                  className={i < rev.rating ? "text-amber-500" : "text-muted-foreground/25"}
                />
              ))}
              <span className="text-[11px] font-bold text-foreground ml-1">
                {rev.rating}.0
              </span>
            </div>
            <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
              {rev.comment}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">{rev.reviewer.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">({rev.reviewer.id})</span>
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
        const seller = row.original.seller
        return (
          <div className="space-y-0.5 min-w-[130px]">
            <Link
              href={`/admin/users/${seller.id}`}
              className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {seller.businessName || seller.name}
            </Link>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="font-mono">{seller.id}</span>
              {seller.businessName && <span>• {seller.name}</span>}
            </div>
          </div>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "listingTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Listing" />
      ),
      cell: ({ row }) => {
        const listing = row.original.listing
        if (!listing) return <span className="text-xs text-muted-foreground">—</span>
        return (
          <div className="flex items-center gap-2 min-w-[160px] max-w-[220px]">
            {listing.imageUrl && (
              <div className="relative size-8 rounded overflow-hidden shrink-0 border border-border/60 bg-muted">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <Link
                href={`/admin/listings/${listing.id}`}
                className="font-medium text-xs text-foreground hover:text-primary transition-colors block truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {listing.title}
              </Link>
              <span className="font-semibold text-[10px] text-primary block">
                ${listing.price.toLocaleString()} {listing.currency}
              </span>
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "reportsCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reports" />
      ),
      cell: ({ row }) => {
        const count = row.original.reportsCount
        if (count <= 0) {
          return <span className="text-xs text-muted-foreground">—</span>
        }
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-bold px-1.5 py-0 h-5 border-destructive/30 text-destructive bg-destructive/5"
          >
            {count} {count === 1 ? "report" : "reports"}
          </Badge>
        )
      },
      sortingFn: "basic",
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <StatusBadge
            label={status === "visible" ? "Visible" : "Hidden"}
            tone={status === "visible" ? "success" : "neutral"}
            size="sm"
          />
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.createdAt}
        </span>
      ),
      sortingFn: "datetime",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rev = row.original
        return (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    aria-label="Review actions"
                  >
                    <DotsThreeVertical size={16} weight="bold" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44 text-xs">
                <DropdownMenuItem
                  onClick={() => onViewDetails(rev)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Review Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/users/${rev.reviewer.id}`}
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <User size={13} />
                      <span>View Reviewer</span>
                    </Link>
                  }
                />
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/users/${rev.seller.id}`}
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <Storefront size={13} />
                      <span>View Seller</span>
                    </Link>
                  }
                />
                {rev.listing && (
                  <DropdownMenuItem
                    render={
                      <Link
                        href={`/admin/listings/${rev.listing.id}`}
                        className="flex items-center gap-2 cursor-pointer w-full"
                      >
                        <ArrowSquareOut size={13} />
                        <span>View Listing</span>
                      </Link>
                    }
                  />
                )}
                <DropdownMenuSeparator />
                {rev.status === "visible" ? (
                  <DropdownMenuItem
                    onClick={() => onRequestHide(rev)}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <EyeSlash size={13} />
                    <span>Hide Review</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onRestore(rev.id)}
                    className="flex items-center gap-2 cursor-pointer text-primary focus:text-primary"
                  >
                    <ArrowCounterClockwise size={13} />
                    <span>Restore Review</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
