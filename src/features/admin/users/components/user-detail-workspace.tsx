"use client"

import { useState } from "react"
import { UserIdentityCard } from "./user-identity-card"
import { UserDetailsPanel } from "./user-details-panel"
import { EditUserSheet } from "./edit-user-sheet"
import type { AdminUserDetail } from "../types"

interface UserDetailWorkspaceProps {
  initialUser: AdminUserDetail
}

export function UserDetailWorkspace({ initialUser }: UserDetailWorkspaceProps) {
  const [user, setUser] = useState<AdminUserDetail>(initialUser)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleSaveUser = (updated: Partial<AdminUserDetail>) => {
    setUser((prev) => ({
      ...prev,
      ...updated,
    }))
  }

  return (
    <div className="space-y-4">
      <UserIdentityCard user={user} onEditClick={() => setIsEditOpen(true)} />
      <UserDetailsPanel user={user} />
      <EditUserSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={user}
        onSave={handleSaveUser}
      />
    </div>
  )
}
