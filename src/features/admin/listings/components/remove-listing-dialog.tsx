"use client"

import { useState } from "react"
import { Trash, Warning, SpinnerGap } from "@phosphor-icons/react"
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

interface RemoveListingDialogProps {
  listing: AdminListing
  open: boolean
  onOpenChange: (open: boolean) => void
  onRemoveSuccess?: (reason: string, note?: string) => void
}

const REMOVAL_REASONS: SelectOption[] = [
  { value: "Safety / Fraud violation", label: "Safety / Fraud violation" },
  { value: "Reported prohibited / counterfeit goods", label: "Reported prohibited / counterfeit goods" },
  { value: "Legal takedown or DMCA copyright request", label: "Legal takedown or DMCA copyright request" },
  { value: "Repeated user complaints & spam", label: "Repeated user complaints & spam" },
  { value: "Seller request / account closure", label: "Seller request / account closure" },
  { value: "Other Policy Violation", label: "Other Policy Violation" },
]

export function RemoveListingDialog({
  listing,
  open,
  onOpenChange,
  onRemoveSuccess,
}: RemoveListingDialogProps) {
  const [selectedReason, setSelectedReason] = useState(REMOVAL_REASONS[0].value)
  const [internalNote, setInternalNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRemove = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onRemoveSuccess?.(selectedReason, internalNote)
      onOpenChange(false)
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-1">
            <Trash size={22} weight="bold" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Remove Active Listing
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Take down <span className="font-semibold text-foreground">&ldquo;{listing.title}&rdquo;</span> (#{listing.id}) from the public marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <Field>
            <FieldLabel required>Takedown Reason</FieldLabel>
            <Select
              value={selectedReason}
              items={REMOVAL_REASONS}
              onValueChange={(val) => val && setSelectedReason(val)}
            >
              <SelectTrigger size="sm" className="h-9.5 w-full text-xs rounded-lg">
                <SelectValue placeholder="Select Reason">
                  {(val) => getSelectOptionLabel(REMOVAL_REASONS, val, "Select Reason")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REMOVAL_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Internal Moderation Note</FieldLabel>
            <Textarea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Record specific investigation notes for the admin audit log..."
              className="text-xs rounded-lg resize-none min-h-20"
            />
          </Field>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-snug">
            <Warning size={16} className="shrink-0 mt-0.5" weight="fill" />
            <span>
              This will immediately de-index the listing, make the public URL unavailable, and send an administrative notice to the seller.
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
            onClick={handleRemove}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5 rounded-lg cursor-pointer"
          >
            {isSubmitting ? (
              <SpinnerGap size={14} className="animate-spin" />
            ) : (
              <Trash size={15} weight="bold" />
            )}
            <span>Remove Listing</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
