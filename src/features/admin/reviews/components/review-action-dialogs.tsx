"use client"

import { useState } from "react"
import { CheckCircle, Prohibit, WarningCircle, Info } from "@phosphor-icons/react"
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
import type { AdminReview } from "../types"

interface ReviewActionDialogsProps {
  review: AdminReview
  actionType: "keep" | "remove" | "escalate" | null
  onClose: () => void
}

export function ReviewActionDialogs({
  review,
  actionType,
  onClose,
}: ReviewActionDialogsProps) {
  const [note, setNote] = useState("")

  const getTitle = () => {
    switch (actionType) {
      case "keep":
        return `Approve & Keep Review (${review.id})`
      case "remove":
        return `Remove Review from Public Display (${review.id})`
      case "escalate":
        return `Escalate Review Dispute (${review.id})`
      default:
        return ""
    }
  }

  const getDescription = () => {
    switch (actionType) {
      case "keep":
        return "Mark this review as adhering to community guidelines. Low ratings are not policy violations on their own."
      case "remove":
        return "Delist this review due to abusive content, spam, competitor manipulation, or external links."
      case "escalate":
        return "Assign to Senior Moderation & Trust Team for transaction verification and mediation."
      default:
        return ""
    }
  }

  return (
    <Dialog open={Boolean(actionType)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            {actionType === "keep" && <CheckCircle size={20} className="text-emerald-500" />}
            {actionType === "remove" && <Prohibit size={20} className="text-destructive" />}
            {actionType === "escalate" && <WarningCircle size={20} className="text-amber-500" />}
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
              Review resolution status will be recorded in the Admin audit log.
            </span>
          </div>

          <Field>
            <FieldLabel required>Moderation Reason & Notes</FieldLabel>
            <Textarea
              placeholder="State policy guidelines or evidence reviewed..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
            variant={actionType === "remove" ? "destructive" : "default"}
            size="sm"
            onClick={onClose}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
          >
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
