"use client"

import { useState } from "react"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserIdentityCard } from "./user-identity-card"
import { UserDetailsPanel } from "./user-details-panel"
import { UserActionDialogs } from "./user-action-dialogs"
import { EditUserSheet } from "./edit-user-sheet"
import type { AdminUserDetail } from "../types"
import { useAdminUserDetail } from "../hooks/users.queries"
import { useDeleteAdminUser, useUpdateAdminUser, useUpdateUserStatus } from "../hooks/users.mutations"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface UserDetailWorkspaceProps {
  userId: string
  initialUser?: AdminUserDetail
}

export function UserDetailWorkspace({ userId, initialUser }: UserDetailWorkspaceProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, isLoading } = useAdminUserDetail(userId)
  const { user: currentAdmin } = useAdminAuth()
  const [localUser, setLocalUser] = useState<AdminUserDetail | null>(initialUser ?? null)
  const [actionType, setActionType] = useState<"suspend" | "restore" | null>(null)
  const [editOpen, setEditOpen] = useState(() => searchParams.get("edit") === "1")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const updateStatus = useUpdateUserStatus()
  const updateUser = useUpdateAdminUser()
  const deleteUser = useDeleteAdminUser()
  const user = data ?? localUser
  const canManageStatus = currentAdmin?.id !== user?.id

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-16 text-xs text-muted-foreground">
        Loading user...
      </div>
    )
  }

  if (!user) {
    notFound()
  }

  const setLocalStatus = (status: AdminUserDetail["status"]) => {
    setLocalUser((prev) => prev ? ({ ...prev, status }) : null)
  }

  const updateUserStatus = async (active: boolean, reason?: string) => {
    await updateStatus.mutateAsync({
      id: user.id,
      status: active ? "active" : "banned",
      reason,
    })
    setLocalStatus(active ? "active" : "suspended")
  }

  const handleDialogConfirm = async (reason?: string) => {
    if (actionType === "suspend") {
      await updateUserStatus(false, reason)
    }
    if (actionType === "restore") {
      await updateUserStatus(true, reason)
    }
    setActionType(null)
  }

  const handleSaveUser = async (updated: Partial<AdminUserDetail>) => {
    const saved = await updateUser.mutateAsync({
      id: user.id,
      data: {
        email: updated.email,
        role: updated.role,
        businessName: updated.businessName,
        bio: updated.bio ?? null,
        sellerType:
          updated.accountType === "dealer"
            ? "dealer"
            : updated.accountType === "business"
            ? "business"
            : updated.accountType === "seller"
            ? "individual"
            : undefined,
      },
    })
    if (saved) {
      setLocalUser(saved)
    }
  }

  const handleDeleteUser = async () => {
    await deleteUser.mutateAsync(user.id)
    setDeleteOpen(false)
    router.push("/admin/users")
  }

  return (
    <div className="space-y-4">
      <UserIdentityCard
        user={user}
        onStatusAction={setActionType}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
        canManageStatus={canManageStatus}
      />
      <UserDetailsPanel
        user={user}
        onStatusChange={(active) => void updateUserStatus(active)}
        isStatusUpdating={updateStatus.isPending}
        canManageStatus={canManageStatus}
      />
      <UserActionDialogs
        user={user}
        actionType={actionType}
        onClose={() => setActionType(null)}
        onConfirm={(reason) => void handleDialogConfirm(reason)}
        isPending={updateStatus.isPending}
      />
      <EditUserSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        onSave={(updated) => void handleSaveUser(updated)}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Delete Account</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This will remove {user.businessName || user.name} from active admin views and prevent login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteUser.isPending || !canManageStatus}
              onClick={() => void handleDeleteUser()}
              className="text-xs font-semibold"
            >
              {deleteUser.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
