"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DotsThreeVertical, ShieldCheck } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminStaffMember } from "./types"

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  moderator: "Moderator",
  support: "Support Agent",
}

const ROLE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  super_admin: "default",
  admin: "default",
  moderator: "secondary",
  support: "outline",
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  suspended: { label: "Suspended", tone: "destructive" },
}

export const staffColumns: ColumnDef<AdminStaffMember>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Admin Staff" />
    ),
    cell: ({ row }) => {
      const staff = row.original
      const initials = staff.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

      return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <Avatar className="size-8 rounded-md shrink-0 border border-border/60">
            <AvatarImage src={staff.avatarUrl} alt={staff.name} />
            <AvatarFallback className="text-[11px] font-semibold bg-muted text-muted-foreground rounded-md">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 min-w-0">
            <span className="font-semibold text-xs text-foreground block truncate">
              {staff.name}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
              <span className="font-mono">{staff.id}</span>
              <span>•</span>
              <span className="truncate">{staff.email}</span>
            </div>
          </div>
        </div>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <Badge
          variant={ROLE_VARIANTS[role] || "outline"}
          className="text-[10px] font-semibold px-1.5 py-0 h-4.5"
        >
          {ROLE_LABELS[role] || role}
        </Badge>
      )
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "twoFactorEnabled",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="2FA Status" />
    ),
    cell: ({ row }) => {
      const enabled = row.original.twoFactorEnabled
      return enabled ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={13} weight="fill" />
          Enforced
        </span>
      ) : (
        <span className="text-[11px] text-amber-600 dark:text-amber-400">Not Set</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "lastActiveAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Active" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.lastActiveAt}</span>
    ),
    sortingFn: "alphanumeric",
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
    cell: () => (
      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-7 text-muted-foreground hover:text-foreground"
                aria-label="Staff actions"
              >
                <DotsThreeVertical size={16} weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36 text-xs">
            <DropdownMenuItem className="text-xs">Edit Role</DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-destructive">Revoke Access</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableSorting: false,
  },
]
