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
  type SelectOption,
} from "@/components/ui/select"
import type { AdminListing } from "../types"

interface RejectListingDialogProps {
  listing: AdminListing
  open: boolean
  onOpenChange: (open: boolean) => void
  onRejectSuccess?: (reason: string, note?: string) => void
}

const REJECTION_REASONS: SelectOption[] = [
  { value: "Incomplete listing information", label: "Incomplete listing information" },
  { value: "Wrong category selected", label: "Wrong category selected" },
  { value: "Misleading title or description", label: "Misleading title or description" },
  { value: "Low quality or invalid images", label: "Low quality or invalid images" },
  { value: "Duplicate listing", label: "Duplicate listing" },
  { value: "Prohibited content / restricted item", label: "Prohibited content / restricted item" },
  { value: "Suspicious pricing / suspected fraud", label: "Suspicious pricing / suspected fraud" },
  { value: "Other Reason", label: "Other Reason" },
]

export function RejectListingDialog({
  listing,
  open,
  onOpenChange,
  onRejectSuccess,
}: RejectListingDialogProps) {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0].value)
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
            Reject Listing Submission
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Reject submission for <span className="font-semibold text-foreground">&ldquo;{listing.title}&rdquo;</span> (#{listing.id}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <Field>
            <FieldLabel required>Rejection Reason</FieldLabel>
            <Select
              value={selectedReason}
              items={REJECTION_REASONS}
              onValueChange={(val) => val && setSelectedReason(val)}
            >
              <SelectTrigger size="sm" className="h-9.5 w-full text-xs rounded-lg">
                <SelectValue placeholder="Select Reason">
                  {(val) => getSelectOptionLabel(REJECTION_REASONS, val, "Select Reason")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Moderator Explanation for Seller</FieldLabel>
            <Textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Provide clear guidance on why the listing was rejected..."
              className="text-xs rounded-lg resize-none min-h-20"
            />
          </Field>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs leading-snug">
            <WarningCircle size={16} className="shrink-0 mt-0.5" weight="fill" />
            <span>
              The seller will receive a rejection notification and can edit the listing to resubmit.
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
            <span>Reject Listing</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
