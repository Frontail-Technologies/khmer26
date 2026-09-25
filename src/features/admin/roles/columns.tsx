"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DotsThreeVertical, UserGear, UserMinus, UserCheck } from "@phosphor-icons/react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminStaffMember, AdminStaffRole } from "./types"

const ROLE_CONFIG: Record<AdminStaffRole, { label: string; badgeClass: string }> = {
  super_admin: {
    label: "Super Admin",
    badgeClass: "bg-primary/10 text-primary border-primary/20 font-bold",
  },
  admin: {
    label: "Admin",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-semibold",
  },
  moderator: {
    label: "Moderator",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold",
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
  onToggleStatus: (staff: AdminStaffMember) => void
}

export function createStaffColumns({
  onEditRole,
  onToggleStatus,
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
              <DropdownMenuContent align="end" className="w-40 text-xs">
                <DropdownMenuItem
                  onClick={() => onEditRole(staff)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UserGear size={13} />
                  <span>Edit Role</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {staff.status === "active" ? (
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(staff)}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <UserMinus size={13} />
                    <span>Deactivate</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(staff)}
                    className="flex items-center gap-2 cursor-pointer text-primary focus:text-primary"
                  >
                    <UserCheck size={13} />
                    <span>Reactivate</span>
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
