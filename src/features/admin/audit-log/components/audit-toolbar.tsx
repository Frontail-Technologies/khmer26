"use client"

import { MagnifyingGlass, ArrowCounterClockwise } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"

interface AuditToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  moduleFilter: string
  onModuleChange: (value: string) => void
  actorFilter: string
  onActorChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onReset: () => void
  hasActiveFilters: boolean
}

const MODULE_OPTIONS = [
  { value: "all", label: "All Modules" },
  { value: "listings", label: "Listings" },
  { value: "verifications", label: "Verifications" },
  { value: "reports", label: "Reports" },
  { value: "users", label: "Users & Sellers" },
  { value: "payments", label: "Payments" },
  { value: "content", label: "Content" },
  { value: "settings", label: "Settings" },
  { value: "roles", label: "Roles & RBAC" },
]

const ACTOR_OPTIONS = [
  { value: "all", label: "All Staff Members" },
  { value: "Chea Rithy", label: "Chea Rithy (Moderator)" },
  { value: "Bona Keo", label: "Bona Keo (Admin)" },
  { value: "Dara Chan", label: "Dara Chan (Super Admin)" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Results" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "failure", label: "Failed" },
]

export function AuditToolbar({
  searchQuery,
  onSearchChange,
  moduleFilter,
  onModuleChange,
  actorFilter,
  onActorChange,
  statusFilter,
  onStatusChange,
  onReset,
  hasActiveFilters,
}: AuditToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4">
      <div className="relative flex-1 min-w-[240px]">
        <MagnifyingGlass
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search audit trail by actor, action, target entity, or IP..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9.5 pl-9.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <Select items={MODULE_OPTIONS} value={moduleFilter} onValueChange={(val) => onModuleChange(val ?? "all")}>
          <SelectTrigger className="h-9.5 text-xs w-[135px]">
            <SelectValue placeholder="All Modules">
              {(val) => getSelectOptionLabel(MODULE_OPTIONS, val, "All Modules")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MODULE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select items={ACTOR_OPTIONS} value={actorFilter} onValueChange={(val) => onActorChange(val ?? "all")}>
          <SelectTrigger className="h-9.5 text-xs w-[145px]">
            <SelectValue placeholder="All Staff Members">
              {(val) => getSelectOptionLabel(ACTOR_OPTIONS, val, "All Staff Members")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ACTOR_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select items={STATUS_OPTIONS} value={statusFilter} onValueChange={(val) => onStatusChange(val ?? "all")}>
          <SelectTrigger className="h-9.5 text-xs w-[120px]">
            <SelectValue placeholder="All Results">
              {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "All Results")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowCounterClockwise size={14} className="mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
