"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Check,
  LockSimple,
} from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DEMO_PERMISSION_GROUPS } from "../data/demo-roles-data"
import type { RoleDefinition } from "../types"

interface RolePermissionsSheetProps {
  role: RoleDefinition | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (roleId: string, permissions: string[]) => void
}

export function RolePermissionsSheet({
  role,
  open,
  onOpenChange,
  onSave,
}: RolePermissionsSheetProps) {
  if (!role) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <RolePermissionsContent
        key={role.id}
        role={role}
        onClose={() => onOpenChange(false)}
        onSave={onSave}
      />
    </Sheet>
  )
}

function RolePermissionsContent({
  role,
  onClose,
  onSave,
}: {
  role: RoleDefinition
  onClose: () => void
  onSave: (roleId: string, permissions: string[]) => void
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions)

  const isSuperAdmin = role.id === "super_admin"

  const togglePermission = (permId: string) => {
    if (isSuperAdmin) return
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    )
  }

  const toggleGroup = (groupId: string) => {
    if (isSuperAdmin) return
    const group = DEMO_PERMISSION_GROUPS.find((g) => g.id === groupId)
    if (!group) return
    const groupPermIds = group.permissions.map((p) => p.id)
    const allSelected = groupPermIds.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !groupPermIds.includes(id)))
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupPermIds])))
    }
  }

  const handleSave = () => {
    onSave(role.id, selectedPermissions)
    onClose()
  }

  return (
    <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card">
      <SheetHeader className="p-4 border-b border-border/60 bg-muted/20 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-sm font-bold text-foreground">
              {role.name} Permissions
            </SheetTitle>
            {isSuperAdmin && (
              <Badge variant="outline" className="text-[10px] font-bold bg-primary/10 text-primary border-primary/20">
                <LockSimple size={10} className="mr-1" />
                System Locked
              </Badge>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{role.staffCount} staff assigned</span>
        </div>
        <p className="text-[11px] text-muted-foreground">{role.description}</p>
      </SheetHeader>

      {isSuperAdmin && (
        <div className="mx-4 mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2 text-xs text-foreground">
          <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" weight="fill" />
          <span>
            Super Admin possesses full platform read and write permissions across all operations. These permissions cannot be revoked.
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {DEMO_PERMISSION_GROUPS.map((group) => {
          const groupPermIds = group.permissions.map((p) => p.id)
          const selectedCount = groupPermIds.filter((id) => selectedPermissions.includes(id)).length
          const isAllGroupSelected = groupPermIds.length > 0 && selectedCount === groupPermIds.length

          return (
            <div
              key={group.id}
              className="p-3.5 rounded-xl bg-background border border-border/70 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-foreground block">
                    {group.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {group.description}
                  </span>
                </div>
                {!isSuperAdmin && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleGroup(group.id)}
                    className="text-[10px] h-6 text-primary"
                  >
                    {isAllGroupSelected ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                {group.permissions.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.id)
                  return (
                    <label
                      key={perm.id}
                      className={`flex items-start gap-2.5 text-xs select-none ${
                        isSuperAdmin ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        disabled={isSuperAdmin}
                        onCheckedChange={() => togglePermission(perm.id)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <span className="font-medium text-xs text-foreground block">
                          {perm.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block leading-relaxed">
                          {perm.description}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs font-semibold cursor-pointer"
        >
          Cancel
        </Button>
        {!isSuperAdmin && (
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="text-xs font-bold cursor-pointer"
          >
            <Check size={14} className="mr-1.5" />
            Save Permissions
          </Button>
        )}
      </div>
    </SheetContent>
  )
}
