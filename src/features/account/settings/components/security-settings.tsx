"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Key,
  DeviceMobile,
  Desktop,
  Trash,
  Warning,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ChangePasswordDialog } from "./change-password-dialog"

export function SecuritySettings() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  return (
    <>
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
        <CardHeader className="p-0 pb-5">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={20} weight="fill" />
            <CardTitle className="text-base font-bold text-foreground">
              Security & Sessions
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Manage your credentials and active sign-in sessions.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-0.5">
                <Key size={18} />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-foreground block">
                  Password
                </span>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Last updated 3 months ago. We recommend updating periodically.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setChangePasswordOpen(true)}
              className="h-9 text-xs font-semibold shrink-0"
            >
              Change Password
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-foreground block">
              Active Sessions
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <Desktop size={20} className="text-primary shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        Chrome on Windows (Current Session)
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-muted-foreground text-[11px]">
                      Phnom Penh, Cambodia • Active now
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <DeviceMobile size={20} className="text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-bold text-foreground">
                      Safari on iPhone 15 Pro
                    </span>
                    <span className="text-muted-foreground text-[11px] block">
                      Phnom Penh, Cambodia • 2 days ago
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="text-xs text-muted-foreground hover:text-foreground h-7"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 sm:p-6 shadow-2xs">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2 text-destructive">
            <Warning size={20} weight="bold" />
            <CardTitle className="text-base font-bold text-destructive">
              Danger Zone
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Permanently remove your account and all associated marketplace listings.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground space-y-0.5">
            <span className="font-bold text-foreground block">
              Delete Account
            </span>
            <p>
              Once deleted, all your active listings, favorites, and history cannot be recovered.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setDeleteAccountOpen(true)}
            className="h-9 px-4 text-xs font-bold gap-1.5 shrink-0"
          >
            <Trash size={16} />
            <span>Delete Account</span>
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
              <Warning size={22} weight="bold" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Delete Account?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              This action is permanent and cannot be undone. Account deletion backend integration is pending in the next phase.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteAccountOpen(false)}
              className="text-xs font-semibold h-10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled
              className="text-xs font-semibold h-10 opacity-60 cursor-not-allowed"
            >
              Confirm Delete (Disabled)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
