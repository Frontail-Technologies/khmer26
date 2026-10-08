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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"
import { UserIdentityCard } from "./user-identity-card"
import { UserDetailsPanel } from "./user-details-panel"
import { UserActionDialogs } from "./user-action-dialogs"
import { EditUserSheet } from "./edit-user-sheet"
import type { AdminUserDetail } from "../types"
import { useAdminUserDetail } from "../hooks/users.queries"
import { useDeleteAdminUser, useUpdateAdminUser, useUpdateUserStatus, useResetUserPassword } from "../hooks/users.mutations"
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
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const updateStatus = useUpdateUserStatus()
  const updateUser = useUpdateAdminUser()
  const deleteUser = useDeleteAdminUser()
  const resetPassword = useResetUserPassword()
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

      <Tabs defaultValue="overview" className="space-y-0">
        <div className="border-b border-border/60 bg-card rounded-t-xl px-3 sm:px-4 overflow-x-auto no-scrollbar shadow-2xs">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <UserDetailsPanel
            user={user}
            onStatusChange={(active) => void updateUserStatus(active)}
            isStatusUpdating={updateStatus.isPending}
            canManageStatus={canManageStatus}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <Card className="bg-card border-0 shadow-2xs rounded-b-xl p-5 space-y-5">
            <div>
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                Password Reset
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Send a password reset email to this user. They will receive an OTP to set a new password.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setResetPasswordOpen(true)}
                disabled={!canManageStatus}
                className="text-xs font-semibold cursor-pointer"
              >
                Send Password Reset Email
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

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
      <ConfirmationDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        title="Send password reset?"
        description={`This will send a password reset email to ${user.email}. They can use it to set a new password.`}
        confirmLabel="Send Reset Email"
        variant="default"
        isPending={resetPassword.isPending}
        onConfirm={() => {
          resetPassword.mutate(user.id, { onSuccess: () => setResetPasswordOpen(false) })
        }}
      />
    </div>
  )
}
