"use client"

import { useState, type FormEvent } from "react"
import { Lock, CheckCircle } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PasswordField } from "@/features/auth/components/password-field"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!currentPassword) {
      setError("Please enter your current password")
      return
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <Lock size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ensure your account is using a long, random password to stay secure.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
              <CheckCircle size={32} weight="fill" />
            </div>
            <p className="text-sm font-bold text-foreground">Password updated successfully!</p>
            <p className="text-xs text-muted-foreground">Your new credentials are now active.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <PasswordField
              id="current-password"
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />

            <PasswordField
              id="new-password"
              label="New Password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />

            <PasswordField
              id="confirm-password"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            {error && (
              <p className="text-xs font-semibold text-destructive">{error}</p>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-xs font-semibold h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs font-semibold h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Update Password
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
