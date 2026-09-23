"use client"

import { useState } from "react"
import { ShieldWarning, Lock, ArrowCounterClockwise, Info } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import type { AdminUserDetail } from "../types"

interface UserActionDialogsProps {
  user: AdminUserDetail
  actionType: "restrict" | "suspend" | "restore" | null
  onClose: () => void
}

export function UserActionDialogs({
  user,
  actionType,
  onClose,
}: UserActionDialogsProps) {
  const [reason, setReason] = useState("")

  const getTitle = () => {
    switch (actionType) {
      case "restrict":
        return `Restrict Account: ${user.name}`
      case "suspend":
        return `Suspend Account: ${user.name}`
      case "restore":
        return `Restore Account: ${user.name}`
      default:
        return ""
    }
  }

  const getDescription = () => {
    switch (actionType) {
      case "restrict":
        return "Apply marketplace restrictions such as disabling new listing creation or hiding contact info."
      case "suspend":
        return "Temporarily or permanently disable access to all marketplace features and delist active items."
      case "restore":
        return "Reinstate standard access and remove any active moderation restrictions on this account."
      default:
        return ""
    }
  }

  return (
    <Dialog open={Boolean(actionType)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            {actionType === "restrict" && <Lock size={20} className="text-amber-500" />}
            {actionType === "suspend" && <ShieldWarning size={20} className="text-destructive" />}
            {actionType === "restore" && <ArrowCounterClockwise size={20} className="text-emerald-500" />}
            <DialogTitle className="text-sm sm:text-base">{getTitle()}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs flex items-start gap-2">
            <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              Action will be logged to the immutable Admin Audit Log with current staff credentials.
            </span>
          </div>

          <Field>
            <FieldLabel required>Reason / Administrative Notes</FieldLabel>
            <Textarea
              placeholder="Provide context or policy references for this action..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-xs min-h-[90px] resize-none rounded-lg"
            />
          </Field>
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={actionType === "suspend" ? "destructive" : "default"}
            size="sm"
            onClick={onClose}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
          >
            Confirm Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
