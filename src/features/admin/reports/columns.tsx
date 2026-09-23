"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import Image from "next/image"
import {
  DotsThreeVertical,
  Flag,
  Tag,
  User,
  Storefront,
  ChatCircle,
  Eye,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ShieldWarning,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
  AdminReport,
  AdminReportPriority,
  AdminReportStatus,
  AdminReportTargetType,
} from "./types"
import { cn } from "@/lib/utils"

const STATUS_TONE_MAP: Record<AdminReportStatus, StatusTone> = {
  open: "warning",
  in_review: "info",
  resolved: "success",
  dismissed: "neutral",
  escalated: "destructive",
}

const STATUS_LABEL_MAP: Record<AdminReportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
  escalated: "Escalated",
}

const STATUS_SORT_ORDER: Record<AdminReportStatus, number> = {
  open: 0,
  in_review: 1,
  escalated: 2,
  resolved: 3,
  dismissed: 4,
}

const PRIORITY_SORT_ORDER: Record<AdminReportPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
}

function getTargetIcon(type: AdminReportTargetType) {
  switch (type) {
    case "listing":
      return <Tag size={13} weight="bold" />
    case "seller":
      return <Storefront size={13} weight="bold" />
    case "user":
      return <User size={13} weight="bold" />
    case "chat":
      return <ChatCircle size={13} weight="bold" />
  }
}

export const reportColumns: ColumnDef<AdminReport>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Report ID" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className="size-6.5 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
          <Flag size={13} weight="fill" />
        </div>
        <Link
          href={`/admin/reports/${row.original.id}`}
          className="font-mono text-xs font-bold text-foreground hover:text-primary transition-colors block truncate"
        >
          {row.original.id}
        </Link>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    id: "target",
    accessorFn: (row) => row.target.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Entity" />
    ),
    cell: ({ row }) => {
      const target = row.original.target
      return (
        <div className="flex items-center gap-2.5 min-w-0 max-w-64">
          <div className="relative size-8 rounded-lg overflow-hidden border border-border/70 bg-muted/40 shrink-0 flex items-center justify-center">
            {target.thumbnail ? (
              <Image
                src={target.thumbnail}
                alt={target.title}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="text-muted-foreground">{getTargetIcon(target.type)}</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip>
              <TooltipTrigger className="block truncate text-left w-full">
                <Link
                  href={`/admin/reports/${row.original.id}`}
                  className="font-semibold text-xs text-foreground hover:text-primary transition-colors block truncate"
                >
                  {target.title}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{target.title}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-mono font-medium text-foreground">{target.id}</span>
              <span>•</span>
              <span className="capitalize">{target.type}</span>
            </div>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    id: "reason",
    accessorKey: "reasonLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => (
      <div className="min-w-0 max-w-52">
        <Tooltip>
          <TooltipTrigger className="block truncate text-left w-full">
            <span className="text-xs text-foreground font-medium block truncate">
              {row.original.reasonLabel}
            </span>
          </TooltipTrigger>
          <TooltipContent>{row.original.statement}</TooltipContent>
        </Tooltip>
        <span className="text-[10px] text-muted-foreground block truncate">
          {row.original.statement}
        </span>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    id: "reporter",
    accessorFn: (row) => row.reporter.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reporter" />
    ),
    cell: ({ row }) => {
      const reporter = row.original.reporter
      return (
        <div className="space-y-0.5 min-w-0 max-w-36">
          <span className="text-xs font-semibold text-foreground block truncate">
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
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold px-2 py-0 h-5 uppercase tracking-wide",
            priority === "urgent"
              ? "bg-destructive/10 text-destructive border-destructive/30"
              : priority === "high"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "bg-muted/60 text-muted-foreground border-border"
          )}
        >
          {priority}
        </Badge>
      )
    },
    sortingFn: (rowA, rowB) => {
      const orderA = PRIORITY_SORT_ORDER[rowA.original.priority] ?? 99
      const orderB = PRIORITY_SORT_ORDER[rowB.original.priority] ?? 99
      return orderA - orderB
    },
  },
  {
    id: "status",
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
    id: "timestamp",
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => (
      <div className="space-y-0.5 min-w-0">
        <span className="text-xs font-medium text-foreground block">
          {row.original.createdAt}
        </span>
        <span className="text-[10px] text-muted-foreground block truncate">
          {row.original.createdDate}
        </span>
      </div>
    ),
    sortingFn: "basic",
  },
  {
    id: "assignedTo",
    accessorFn: (row) => row.assignedTo || "Unassigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }) => (
      <span
        className={cn(
          "text-xs font-medium",
          row.original.assignedTo ? "text-foreground" : "text-muted-foreground/70"
        )}
      >
        {row.original.assignedTo || "Unassigned"}
      </span>
    ),
    sortingFn: "alphanumeric",
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
                    className="flex items-center gap-2 w-full text-xs font-medium"
                  >
                    <Eye size={14} />
                    <span>Review Report</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link
                    href={report.target.href}
                    className="flex items-center gap-2 w-full text-xs font-medium text-muted-foreground"
                  >
                    <ArrowUpRight size={14} />
                    <span>Open Target Entity</span>
                  </Link>
                }
              />
              <DropdownMenuSeparator />
              {report.status !== "resolved" && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="flex items-center gap-2 w-full text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle size={14} />
                      <span>Resolve Report</span>
                    </Link>
                  }
                />
              )}
              {report.status !== "dismissed" && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="flex items-center gap-2 w-full text-xs font-medium text-muted-foreground"
                    >
                      <XCircle size={14} />
                      <span>Dismiss Report</span>
                    </Link>
                  }
                />
              )}
              {report.status !== "escalated" && (
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="flex items-center gap-2 w-full text-xs font-medium text-destructive"
                    >
                      <ShieldWarning size={14} />
                      <span>Escalate Case</span>
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
