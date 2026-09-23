"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DotsThreeVertical, IdentificationCard, Buildings, UserCircle } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { VerificationRequest, VerificationStatus } from "./types"

const STATUS_TONE_MAP: Record<VerificationStatus, StatusTone> = {
  pending: "warning",
  in_review: "info",
  approved: "success",
  rejected: "destructive",
}

const STATUS_LABEL_MAP: Record<VerificationStatus, string> = {
  pending: "Pending",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
}

const STATUS_SORT_ORDER: Record<VerificationStatus, number> = {
  pending: 0,
  in_review: 1,
  approved: 2,
  rejected: 3,
}

export const verificationColumns: ColumnDef<VerificationRequest>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request ID" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/admin/verifications/${row.original.id}`}
        className="font-mono text-xs font-bold text-foreground hover:text-primary transition-colors"
      >
        {row.original.id}
      </Link>
    ),
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
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-8 rounded-full border border-border/70 shrink-0">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
              {seller.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 max-w-44">
            <Tooltip>
              <TooltipTrigger className="block truncate text-left w-full">
                <Link
                  href={`/admin/verifications/${row.original.id}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                >
                  {seller.name}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{seller.name}</TooltipContent>
            </Tooltip>
            <span className="text-[11px] text-muted-foreground block truncate">
              {seller.phone || seller.email}
            </span>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.type
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {type === "identity" ? (
            <IdentificationCard size={15} className="text-primary shrink-0" />
          ) : type === "business" ? (
            <Buildings size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
          ) : (
            <UserCircle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span className="capitalize font-medium text-foreground">{type}</span>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    id: "sellerType",
    accessorFn: (row) => row.seller.sellerType,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seller Type" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground capitalize">
        {row.original.seller.sellerType}
      </span>
    ),
  },
  {
    id: "documents",
    header: () => <span className="text-[11px] font-semibold text-muted-foreground">Documents</span>,
    cell: ({ row }) => (
      <span className="text-xs font-medium text-foreground">
        {row.original.documents.length} files
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "submittedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <span className="text-xs font-medium text-foreground block">
          {row.original.submittedAt}
        </span>
        <span className="text-[10px] text-muted-foreground block">
          {row.original.submittedDate}
        </span>
      </div>
    ),
    sortingFn: "datetime",
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
          label={STATUS_LABEL_MAP[status]}
          tone={STATUS_TONE_MAP[status]}
          size="sm"
        />
      )
    },
    sortingFn: (rowA, rowB) => {
      const orderA = STATUS_SORT_ORDER[rowA.original.status] ?? 99
      const orderB = STATUS_SORT_ORDER[rowB.original.status] ?? 99
      return orderA - orderB
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }) => {
      const assigned = row.original.assignedTo
      if (!assigned) {
        return <StatusBadge label="Unassigned" tone="neutral" size="sm" />
      }
      return (
        <span className="text-xs font-medium text-foreground">
          {assigned}
        </span>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Verification actions"
              >
                <DotsThreeVertical size={16} weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              render={
                <Link
                  href={`/admin/verifications/${row.original.id}`}
                  className="flex items-center gap-2 w-full text-xs font-medium"
                >
                  <span>Review Request</span>
                </Link>
              }
            />
            {row.original.seller.slug && (
              <DropdownMenuItem
                render={
                  <Link
                    href={`/seller/${row.original.seller.slug}`}
                    target="_blank"
                    className="flex items-center gap-2 w-full text-xs font-medium text-muted-foreground"
                  >
                    <span>View Public Seller</span>
                  </Link>
                }
              />
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link
                  href={`/admin/verifications/${row.original.id}`}
                  className="flex items-center gap-2 w-full text-xs font-medium text-primary"
                >
                  <span>Inspect Documents</span>
                </Link>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableSorting: false,
  },
]
