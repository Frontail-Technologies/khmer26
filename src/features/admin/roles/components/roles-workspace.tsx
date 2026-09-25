"use client"

import { useState, useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table"
import {
  MagnifyingGlass,
  Plus,
  ShieldCheck,
  UserPlus,
  UserGear,
  DotsThreeVertical,
  UserMinus,
  UserCheck,
} from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { createStaffColumns } from "../columns"
import { RolePermissionsSheet } from "./role-permissions-sheet"
import type { AdminStaffMember, RoleDefinition, AdminStaffRole } from "../types"
import { cn } from "@/lib/utils"

interface RolesWorkspaceProps {
  initialStaff: AdminStaffMember[]
  initialRoles: RoleDefinition[]
}

type RolesTabKey = "staff" | "roles"

const ROLE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support Agent" },
]

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

export function RolesWorkspace({
  initialStaff,
  initialRoles,
}: RolesWorkspaceProps) {
  const [staffList, setStaffList] = useState<AdminStaffMember[]>(initialStaff)
  const [rolesList, setRolesList] = useState<RoleDefinition[]>(initialRoles)
  const [activeTab, setActiveTab] = useState<RolesTabKey>("staff")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null)
  const [permissionsSheetOpen, setPermissionsSheetOpen] = useState(false)

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<AdminStaffRole>("admin")

  const [editRoleStaff, setEditRoleStaff] = useState<AdminStaffMember | null>(null)
  const [newStaffRole, setNewStaffRole] = useState<AdminStaffRole>("admin")

  const handleEditRole = useCallback((staff: AdminStaffMember) => {
    setEditRoleStaff(staff)
    setNewStaffRole(staff.role)
  }, [])

  const handleToggleStatus = useCallback((staff: AdminStaffMember) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staff.id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    )
  }, [])

  const handleSaveStaffRole = () => {
    if (!editRoleStaff) return
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === editRoleStaff.id ? { ...s, role: newStaffRole } : s
      )
    )
    setEditRoleStaff(null)
  }

  const handleOpenPermissionsSheet = (role: RoleDefinition) => {
    setSelectedRole(role)
    setPermissionsSheetOpen(true)
  }

  const handleSaveRolePermissions = (roleId: string, permissions: string[]) => {
    setRolesList((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    )
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newMember: AdminStaffMember = {
      id: `STF-${100 + staffList.length + 1}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "active",
      lastActiveAt: "Just now",
      joinedAt: "Today",
    }

    setStaffList((prev) => [newMember, ...prev])
    setInviteName("")
    setInviteEmail("")
    setInviteRole("admin")
    setInviteDialogOpen(false)
  }

  const filteredStaff = useMemo(() => {
    return staffList.filter((item) => {
      if (roleFilter !== "all" && item.role !== roleFilter) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesEmail = item.email.toLowerCase().includes(q)
        const matchesId = item.id.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesId) {
          return false
        }
      }

      return true
    })
  }, [staffList, roleFilter, searchQuery])

  const columns = useMemo(() => {
    return createStaffColumns({
      onEditRole: handleEditRole,
      onToggleStatus: handleToggleStatus,
    })
  }, [handleEditRole, handleToggleStatus])

  const table = useReactTable({
    data: filteredStaff,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const tabs: { key: RolesTabKey; label: string; count: number }[] = [
    { key: "staff", label: "Admin Staff", count: staffList.length },
    { key: "roles", label: "Roles", count: rolesList.length },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 border-transparent",
                    isActive
                      ? "bg-card text-foreground border-primary shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span>{tab.label}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 h-4 text-[10px] font-bold rounded-md border",
                      isActive
                        ? "bg-muted text-foreground border-border"
                        : "bg-background/80 text-muted-foreground border-border/60"
                    )}
                  >
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === "staff" ? (
          <>
            <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search staff name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Select
                  value={roleFilter}
                  items={ROLE_OPTIONS}
                  onValueChange={(val) => setRoleFilter(val ?? "all")}
                >
                  <SelectTrigger className="h-9 text-xs w-[140px] shrink-0">
                    <SelectValue placeholder="All Roles">
                      {(val) => getSelectOptionLabel(ROLE_OPTIONS, val, "All Roles")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setInviteDialogOpen(true)}
                  className="h-9 px-3 text-xs font-bold rounded-lg cursor-pointer"
                >
                  <Plus size={14} className="mr-1" weight="bold" />
                  Invite Admin
                </Button>
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto min-w-0">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="bg-muted/60 dark:bg-muted/90 hover:bg-muted/60 dark:hover:bg-muted/90 border-b border-border/80 select-none"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-muted/40 transition-colors border-b border-border/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3 px-4 text-xs">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <DataTableEmpty
                      colSpan={columns.length}
                      title="No staff members found"
                      description="Try clearing search or filter parameters."
                    />
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden divide-y divide-border/60">
              {filteredStaff.length ? (
                filteredStaff.map((staff) => {
                  const initials = staff.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                  const roleConf = ROLE_CONFIG[staff.role] || ROLE_CONFIG.support
                  const statusConf = STATUS_CONFIG[staff.status] || {
                    label: staff.status,
                    tone: "neutral" as StatusTone,
                  }

                  return (
                    <div
                      key={staff.id}
                      className="p-3.5 space-y-2.5 hover:bg-muted/20 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar className="size-8.5 rounded-full shrink-0 border border-border/60">
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

                        <div className="flex items-center gap-1.5 shrink-0">
                          <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
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
                                onClick={() => handleEditRole(staff)}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <UserGear size={13} />
                                <span>Edit Role</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {staff.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(staff)}
                                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <UserMinus size={13} />
                                  <span>Deactivate</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(staff)}
                                  className="flex items-center gap-2 cursor-pointer text-primary focus:text-primary"
                                >
                                  <UserCheck size={13} />
                                  <span>Reactivate</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 h-5 ${roleConf.badgeClass}`}
                        >
                          {roleConf.label}
                        </Badge>
                        <span className="text-[10px]">Active: {staff.lastActiveAt}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <DataTableEmpty
                  colSpan={1}
                  title="No staff members found"
                  description="Try clearing search or filter parameters."
                />
              )}
            </div>

            <div className="border-t border-border/60">
              <DataTablePagination table={table} />
            </div>
          </>
        ) : (
          <div className="divide-y divide-border/60">
            {rolesList.map((role) => {
              const roleConf = ROLE_CONFIG[role.id] || ROLE_CONFIG.support
              return (
                <div
                  key={role.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2.5 py-0.5 h-6 ${roleConf.badgeClass}`}
                      >
                        {role.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {role.staffCount} staff members
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-medium">
                      {role.accessSummary}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {role.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPermissionsSheet(role)}
                      className="text-xs font-semibold cursor-pointer h-8.5"
                    >
                      <ShieldCheck size={14} className="mr-1.5 text-primary" />
                      {role.isSystem ? "View Permissions" : "Edit Permissions"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <RolePermissionsSheet
        role={selectedRole}
        open={permissionsSheetOpen}
        onOpenChange={setPermissionsSheetOpen}
        onSave={handleSaveRolePermissions}
      />

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
          <form onSubmit={handleInviteSubmit}>
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <UserPlus size={20} />
                <DialogTitle className="text-sm sm:text-base">
                  Invite Administrator
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Add an internal team member to the Khmer26 Admin Portal and assign their initial role.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3 text-xs">
              <Field>
                <FieldLabel required>Full Name</FieldLabel>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sothea Chan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </Field>

              <Field>
                <FieldLabel required>Work Email Address</FieldLabel>
                <input
                  type="email"
                  required
                  placeholder="name@khmer26.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </Field>

              <Field>
                <FieldLabel required>Role & Access Level</FieldLabel>
                <Select
                  value={inviteRole}
                  items={ROLE_OPTIONS.filter((o) => o.value !== "all")}
                  onValueChange={(val) => setInviteRole((val as AdminStaffRole) ?? "admin")}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue placeholder="Select role">
                      {(val) => getSelectOptionLabel(ROLE_OPTIONS, val, "Admin")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <DialogFooter className="flex flex-row gap-2 pt-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInviteDialogOpen(false)}
                className="flex-1 sm:flex-initial h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
              >
                Send Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editRoleStaff)} onOpenChange={(open) => !open && setEditRoleStaff(null)}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <UserGear size={20} />
              <DialogTitle className="text-sm sm:text-base">
                Edit Staff Role ({editRoleStaff?.name})
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Change the operational role and permissions for this administrator.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 text-xs space-y-3">
            <Field>
              <FieldLabel required>Role Assignment</FieldLabel>
              <Select
                value={newStaffRole}
                items={ROLE_OPTIONS.filter((o) => o.value !== "all")}
                onValueChange={(val) => setNewStaffRole((val as AdminStaffRole) ?? "admin")}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Select role">
                    {(val) => getSelectOptionLabel(ROLE_OPTIONS, val, "Admin")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter className="flex flex-row gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditRoleStaff(null)}
              className="flex-1 sm:flex-initial h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSaveStaffRole}
              className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
