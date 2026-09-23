"use client"

import { useState } from "react"
import { WarningCircle, XCircle, SpinnerGap } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import type { VerificationRequest } from "../types"

interface RejectVerificationDialogProps {
  request: VerificationRequest
  open: boolean
  onOpenChange: (open: boolean) => void
  onRejectSuccess?: (reason: string, note?: string) => void
}

const REJECTION_REASONS = [
  "Document Unclear / Blurry",
  "Document Expired",
  "Information Mismatch with Registry",
  "Incomplete Submission (Missing Pages)",
  "Business License Cannot Be Verified",
  "Other Reason",
]

const REJECTION_OPTIONS = REJECTION_REASONS.map((r) => ({ value: r, label: r }))

export function RejectVerificationDialog({
  request,
  open,
  onOpenChange,
  onRejectSuccess,
}: RejectVerificationDialogProps) {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0])
  const [customNote, setCustomNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReject = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onRejectSuccess?.(selectedReason, customNote)
      onOpenChange(false)
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-1">
            <XCircle size={24} weight="fill" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Reject Verification Request
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Reject verification request <span className="font-mono font-semibold text-foreground">#{request.id}</span> for <span className="font-semibold text-foreground">{request.seller.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <Field>
            <FieldLabel required>Primary Rejection Reason</FieldLabel>
            <Select
              value={selectedReason}
              items={REJECTION_OPTIONS}
              onValueChange={(val) => val && setSelectedReason(val)}
            >
              <SelectTrigger size="sm" className="h-9.5 w-full text-xs rounded-lg">
                <SelectValue>
                  {(val) => getSelectOptionLabel(REJECTION_OPTIONS, val, "Select a reason")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Explanation & Feedback for Seller</FieldLabel>
            <Textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Provide specific details about what is required..."
              className="text-xs rounded-lg resize-none min-h-20"
            />
          </Field>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs leading-snug">
            <WarningCircle size={16} className="shrink-0 mt-0.5" />
            <span>
              The seller will be notified via in-app alert and email with this feedback.
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={handleReject}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5 rounded-lg cursor-pointer"
          >
            {isSubmitting ? (
              <SpinnerGap size={14} className="animate-spin" />
            ) : (
              <XCircle size={15} weight="bold" />
            )}
            <span>Reject Request</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
