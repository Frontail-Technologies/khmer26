"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import Image from "next/image"
import {
  DotsThreeVertical,
  Tag,
  User,
  Storefront,
  ChatCircle,
  Eye,
  ArrowUpRight,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AdminReport, AdminReportStatus, AdminReportTargetType } from "./types"

const STATUS_CONFIG: Record<AdminReportStatus, { label: string; tone: StatusTone }> = {
  open: { label: "Open", tone: "warning" },
  in_review: { label: "In Review", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
}

const TARGET_TYPE_LABELS: Record<AdminReportTargetType, string> = {
  listing: "Listing",
  user: "User",
  seller: "Seller",
  chat: "Chat",
}

function getTargetIcon(type: AdminReportTargetType) {
  switch (type) {
    case "listing":
      return <Tag size={14} weight="bold" />
    case "seller":
      return <Storefront size={14} weight="bold" />
    case "user":
      return <User size={14} weight="bold" />
    case "chat":
      return <ChatCircle size={14} weight="bold" />
  }
}

export const reportColumns: ColumnDef<AdminReport>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Report" />
    ),
    cell: ({ row }) => {
      const report = row.original
      return (
        <div className="space-y-0.5 min-w-[90px]">
          <Link
            href={`/admin/reports/${report.id}`}
            className="font-mono text-xs font-bold text-foreground hover:text-primary transition-colors block"
          >
            {report.id}
          </Link>
          <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4 capitalize">
            {TARGET_TYPE_LABELS[report.targetType] || report.targetType}
          </Badge>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    id: "target",
    accessorFn: (row) => row.target.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported Item" />
    ),
    cell: ({ row }) => {
      const target = row.original.target
      return (
        <div className="flex items-center gap-3 min-w-[220px] max-w-sm">
          <div className="relative size-9 rounded-lg overflow-hidden border border-border/70 bg-muted/40 shrink-0 flex items-center justify-center">
            {target.thumbnail ? (
              <Image
                src={target.thumbnail}
                alt={target.title}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="text-muted-foreground">{getTargetIcon(target.type)}</div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <Link
              href={`/admin/reports/${row.original.id}`}
              className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
            >
              {target.title}
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <span className="font-mono text-[10px] text-muted-foreground/80">{target.id}</span>
              {target.sellerName && (
                <>
                  <span>·</span>
                  <span className="truncate">{target.sellerName}</span>
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
    accessorKey: "reasonLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[140px] max-w-xs space-y-0.5">
        <span className="text-xs text-foreground font-medium block truncate">
          {row.original.reasonLabel}
        </span>
        <span className="text-[11px] text-muted-foreground block truncate">
          {row.original.statement}
        </span>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "reporter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reporter" />
    ),
    cell: ({ row }) => {
      const reporter = row.original.reporter
      return (
        <div className="space-y-0.5 min-w-[110px]">
          <span className="text-xs font-medium text-foreground block truncate">
            {reporter.name}
          </span>
          <span className="text-[10px] text-muted-foreground block capitalize">
            {reporter.accountType}
          </span>
        </div>
      )
    },
    sortingFn: "alphanumeric",
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
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported At" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5 min-w-[100px]">
        <span className="text-xs text-foreground block whitespace-nowrap">
          {row.original.createdAt}
        </span>
        <span className="text-[10px] text-muted-foreground block whitespace-nowrap">
          {row.original.createdDate}
        </span>
      </div>
    ),
    sortingFn: "basic",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original
      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Report actions"
                >
                  <DotsThreeVertical size={16} weight="bold" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={
                  <Link
                    href={`/admin/reports/${report.id}`}
                    className="flex items-center gap-2 w-full text-xs font-medium cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View Report</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link
                    href={report.target.href}
                    className="flex items-center gap-2 w-full text-xs font-medium text-muted-foreground cursor-pointer"
                  >
                    <ArrowUpRight size={14} />
                    <span>View Reported Item</span>
                  </Link>
                }
              />
              <DropdownMenuSeparator />
              {report.status !== "resolved" && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="flex items-center gap-2 w-full text-xs font-medium text-emerald-600 dark:text-emerald-400 cursor-pointer"
                    >
                      <CheckCircle size={14} />
                      <span>Resolve</span>
                    </Link>
                  }
                />
              )}
              {report.status !== "dismissed" && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="flex items-center gap-2 w-full text-xs font-medium text-muted-foreground cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Dismiss</span>
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
