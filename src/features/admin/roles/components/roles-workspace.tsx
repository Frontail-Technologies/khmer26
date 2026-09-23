"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersThree, LockKey } from "@phosphor-icons/react"
import { RolesSummaryMetrics } from "./roles-summary-metrics"
import { StaffTable } from "./staff-table"
import { PermissionsMatrix } from "./permissions-matrix"
import type {
  AdminStaffMember,
  PermissionGroup,
  RoleDefinition,
  RoleStats,
} from "../types"

interface RolesWorkspaceProps {
  stats: RoleStats
  staff: AdminStaffMember[]
  roles: RoleDefinition[]
  groups: PermissionGroup[]
}

export function RolesWorkspace({
  stats,
  staff,
  roles,
  groups,
}: RolesWorkspaceProps) {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <RolesSummaryMetrics stats={stats} />

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid grid-cols-2 h-9 bg-muted/60 p-1 mb-4 w-full sm:w-[360px]">
          <TabsTrigger value="staff" className="text-xs">
            <UsersThree size={13} className="mr-1.5" />
            Admin Staff ({staff.length})
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs">
            <LockKey size={13} className="mr-1.5" />
            Roles & Access Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <StaffTable initialStaff={staff} />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsMatrix roles={roles} groups={groups} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
