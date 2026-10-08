"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { UserGear, Trash } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminStaffMember, AdminStaffRole } from "./types"

const ROLE_CONFIG: Record<AdminStaffRole, { label: string; badgeClass: string }> = {
  super_admin: {
    label: "Super Admin",
    badgeClass: "bg-primary/10 text-primary border-primary/20 font-bold",
  },
  admin: {
    label: "Admin",
    badgeClass: "bg-primary/10 text-primary border-primary/20 font-semibold",
  },
  moderator: {
    label: "Moderator",
    badgeClass: "bg-accent/10 text-accent border-accent/20 font-semibold",
  },
  support: {
    label: "Support Agent",
    badgeClass: "bg-muted text-muted-foreground border-border/80 font-medium",
  },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
}

interface StaffColumnOptions {
  onEditRole: (staff: AdminStaffMember) => void
  onDeleteStaff: (staff: AdminStaffMember) => void
}

export function createStaffColumns({
  onEditRole,
  onDeleteStaff,
}: StaffColumnOptions): ColumnDef<AdminStaffMember>[] {
  return [
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
            <Avatar className="size-8 rounded-full shrink-0 border border-border/60">
              <AvatarImage src={staff.avatarUrl} alt={staff.name} />
              <AvatarFallback className="text-[11px] font-bold bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 min-w-0">
              <span className="font-semibold text-xs text-foreground block truncate">
                {staff.name}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
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
        const conf = ROLE_CONFIG[role] || ROLE_CONFIG.support
        return (
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 h-5 ${conf.badgeClass}`}
          >
            {conf.label}
          </Badge>
        )
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "lastActiveAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Active" />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.lastActiveAt}
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
        const staff = row.original
        return (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label="Edit role"
              onClick={() => onEditRole(staff)}
            >
              <UserGear size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-7 text-destructive hover:bg-destructive/10"
              aria-label="Remove staff member"
              onClick={() => onDeleteStaff(staff)}
            >
              <Trash size={13} />
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
