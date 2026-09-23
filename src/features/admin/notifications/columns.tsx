"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Bell, ChatText, DeviceMobile, PaperPlaneTilt } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { NotificationCampaign } from "./types"

const AUDIENCE_LABELS: Record<string, string> = {
  all_users: "All Marketplace Users",
  sellers: "Individual & Pro Sellers",
  dealers: "Verified Dealerships",
  buyers: "Buyer Accounts",
}

const CHANNEL_ICONS: Record<string, { label: string; icon: React.ReactNode }> = {
  in_app: { label: "In-App Notice", icon: <Bell size={13} className="text-blue-500" /> },
  push: { label: "Mobile Push", icon: <DeviceMobile size={13} className="text-purple-500" /> },
  sms: { label: "SMS Broadcast", icon: <ChatText size={13} className="text-emerald-500" /> },
  telegram: { label: "Telegram Bot", icon: <PaperPlaneTilt size={13} className="text-sky-500" /> },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  delivered: { label: "Delivered", tone: "success" },
  sending: { label: "Sending", tone: "warning" },
  scheduled: { label: "Scheduled", tone: "info" },
  failed: { label: "Failed", tone: "destructive" },
}

export const notificationColumns: ColumnDef<NotificationCampaign>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campaign" />
    ),
    cell: ({ row }) => {
      const camp = row.original
      return (
        <div className="space-y-0.5 min-w-[220px]">
          <span className="font-semibold text-xs text-foreground block truncate">
            {camp.title}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="font-mono">{camp.id}</span>
            <span>•</span>
            <span>By {camp.sentBy}</span>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "audience",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Audience" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-[10px] font-medium">
        {AUDIENCE_LABELS[row.original.audience] || row.original.audience}
      </Badge>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "channel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel" />
    ),
    cell: ({ row }) => {
      const ch = CHANNEL_ICONS[row.original.channel] || { label: row.original.channel, icon: null }
      return (
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          {ch.icon}
          <span className="text-xs">{ch.label}</span>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "sentAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sent Date" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.sentAt}</span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "recipientsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivered" />
    ),
    cell: ({ row }) => (
      <div className="text-xs space-y-0.5">
        <span className="font-semibold text-foreground block">
          {row.original.recipientsCount.toLocaleString()}
        </span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
          {row.original.deliveryRate} success
        </span>
      </div>
    ),
    sortingFn: "basic",
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
]
