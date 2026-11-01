"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import {
  Flag,
  SealCheck,
  MapPin,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ListingRowActions } from "./components/listing-row-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ListingImageAvatars } from "./components/listing-image-avatars"
import type { AdminListing, AdminListingStatus } from "./types"

const STATUS_TONE_MAP: Record<AdminListingStatus, StatusTone> = {
  pending: "warning",
  flagged: "destructive",
  active: "success",
  sold: "neutral",
  expired: "neutral",
  rejected: "destructive",
  removed: "destructive",
  draft: "neutral",
}

const STATUS_LABEL_MAP: Record<AdminListingStatus, string> = {
  pending: "Pending",
  flagged: "Flagged",
  active: "Active",
  sold: "Sold",
  expired: "Expired",
  rejected: "Rejected",
  removed: "Removed",
  draft: "Draft",
}

const STATUS_SORT_ORDER: Record<AdminListingStatus, number> = {
  pending: 0,
  flagged: 1,
  active: 2,
  sold: 3,
  expired: 4,
  rejected: 5,
  removed: 6,
  draft: 7,
}

export const listingColumns: ColumnDef<AdminListing>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center px-1" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
          aria-label="Select all listings"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-1" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
          aria-label={`Select listing ${row.original.id}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "listing",
    accessorFn: (row) => row.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing" />
    ),
    cell: ({ row }) => {
      const listing = row.original
      return (
        <div className="flex items-center gap-3 min-w-0 max-w-72 lg:max-w-80 py-1">
          <ListingImageAvatars images={listing.images} title={listing.title} />
          <div className="min-w-0 flex-1 space-y-0.5">
            <Tooltip>
              <TooltipTrigger className="block truncate text-left w-full">
                <Link
                  href={`/admin/listings/${listing.id}`}
                  className="font-bold text-xs text-foreground hover:text-primary transition-colors block truncate"
                >
                  {listing.title}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{listing.title}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1.5 text-xxs text-muted-foreground">
              <span className="capitalize">{listing.condition}</span>
              {listing.reports.length > 0 && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-0.5 text-destructive font-bold text-2xs">
                    <Flag size={10} weight="fill" />
                    <span>{listing.reports.length}</span>
                  </span>
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
    id: "seller",
    accessorFn: (row) => row.seller.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seller" />
    ),
    cell: ({ row }) => {
      const seller = row.original.seller
      return (
        <div className="flex items-center gap-2.5 min-w-0 max-w-44 py-1">
          <Avatar className="size-7 rounded-full border border-border/70 shrink-0">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback className="text-2xs font-bold bg-primary/10 text-primary">
              {seller.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5">
            <Tooltip>
              <TooltipTrigger className="block truncate text-left w-full">
                <span className="text-xs font-semibold text-foreground truncate block">
                  {seller.name}
                </span>
              </TooltipTrigger>
              <TooltipContent>{seller.name}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1 text-2xs text-muted-foreground">
              <span className="capitalize">{seller.sellerType}</span>
              {seller.verified && (
                <SealCheck size={12} weight="fill" className="text-primary shrink-0" />
              )}
            </div>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.original.price
      const formatted =
        row.original.currency === "USD"
          ? `$${price.toLocaleString("en-US")}`
          : `${price.toLocaleString("en-US")} KHR`
      return (
        <span className="text-xs font-bold text-foreground font-mono">
          {formatted}
        </span>
      )
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-foreground font-medium">
        {row.original.categoryName}
      </span>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const reports = row.original.reports
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge
            label={STATUS_LABEL_MAP[status]}
            tone={STATUS_TONE_MAP[status]}
            size="sm"
          />
          {reports.length > 0 && status === "flagged" && (
            <span className="inline-flex items-center gap-0.5 text-2xs font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
              <Flag size={10} weight="fill" />
              <span>{reports.length}</span>
            </span>
          )}
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const orderA = STATUS_SORT_ORDER[rowA.original.status] ?? 99
      const orderB = STATUS_SORT_ORDER[rowB.original.status] ?? 99
      return orderA - orderB
    },
  },
  {
    id: "location",
    accessorFn: (row) => row.location.province,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const loc = row.original.location
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0 max-w-36">
          <MapPin size={13} className="shrink-0 text-muted-foreground/70" />
          <span className="truncate">{loc.province}</span>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <span className="text-xs font-medium text-foreground block whitespace-nowrap">
          {row.original.createdDate}
        </span>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ListingRowActions listing={row.original} />,
    enableSorting: false,
  },
]


