"use client"

import { useState } from "react"
import {
  LockKey,
  Info,
  FloppyDisk,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RoleDefinition, PermissionGroup, AdminStaffRole } from "../types"

interface PermissionsMatrixProps {
  roles: RoleDefinition[]
  groups: PermissionGroup[]
}

export function PermissionsMatrix({ roles: initialRoles, groups }: PermissionsMatrixProps) {
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<AdminStaffRole>("admin")

  const currentRole = roles.find((r) => r.id === selectedRole) ?? roles[0]

  const togglePermission = (permKey: string) => {
    if (selectedRole === "super_admin") return

    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRole) return r
        const hasPerm = r.grantedPermissions.includes(permKey)
        const updated = hasPerm
          ? r.grantedPermissions.filter((k) => k !== permKey)
          : [...r.grantedPermissions, permKey]
        return { ...r, grantedPermissions: updated }
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            System Roles ({roles.length})
          </div>

          {roles.map((role) => {
            const isSelected = role.id === selectedRole
            return (
              <Card
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "p-3.5 cursor-pointer transition-all rounded-xl text-xs",
                  isSelected
                    ? "bg-primary/10 text-primary border-0 ring-1 ring-primary/30 shadow-2xs"
                    : "bg-card border-0 shadow-2xs hover:bg-muted/20"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground block">{role.name}</span>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {role.assignedStaffCount} Staff
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {role.description}
                </p>
              </Card>
            )
          })}
        </div>

        <div className="lg:col-span-8">
          <Card className="bg-card border-0 rounded-xl shadow-2xs">
            <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <LockKey size={14} />
                  Permissions Matrix: {currentRole.name}
                </CardTitle>
                <span className="text-[10px] text-muted-foreground block">
                  {currentRole.grantedPermissions.length} of {groups.reduce((acc, g) => acc + g.permissions.length, 0)} permissions granted
                </span>
              </div>

              <Button size="sm" className="h-8 text-xs">
                <FloppyDisk size={14} className="mr-1.5" />
                Save Policy
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border-0 flex items-start gap-2 text-muted-foreground">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  UI permission toggles configure role templates. Backend API routes enforce session JWT claims independently.
                </p>
              </div>

              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div className="space-y-0.5 pb-1 border-b border-border/40">
                      <span className="font-bold text-foreground text-xs block">{group.name}</span>
                      <span className="text-[10px] text-muted-foreground block">{group.description}</span>
                    </div>

                    <div className="space-y-1.5">
                      {group.permissions.map((perm) => {
                        const isGranted = currentRole.grantedPermissions.includes(perm.key)
                        return (
                          <div
                            key={perm.key}
                            className="p-2.5 rounded-lg bg-muted/30 border-0 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{perm.name}</span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  ({perm.key})
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                            </div>

                            <Switch
                              checked={isGranted}
                              disabled={selectedRole === "super_admin"}
                              onCheckedChange={() => togglePermission(perm.key)}
                              aria-label={`Toggle ${perm.name}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
