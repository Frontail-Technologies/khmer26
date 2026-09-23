"use client"

import { useState } from "react"
import { XCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import type { AdminReport } from "../types"

interface DismissReportDialogProps {
  report: AdminReport
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DISMISS_REASONS = [
  { value: "insufficient_info", label: "Insufficient Information / Unsubstantiated" },
  { value: "no_violation", label: "No Policy Violation Found" },
  { value: "duplicate", label: "Duplicate Complaint" },
  { value: "invalid_report", label: "Invalid / Abusive Report Claim" },
  { value: "other", label: "Other Administrative Reason" },
]

export function DismissReportDialog({
  report,
  open,
  onOpenChange,
}: DismissReportDialogProps) {
  const [reason, setReason] = useState("no_violation")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mb-1">
            <XCircle size={22} weight="bold" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Dismiss Report #{report.id}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Dismiss this report without taking punitive action against the reported target.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <Field>
            <FieldLabel required>Dismissal Reason</FieldLabel>
            <Select
              value={reason}
              items={DISMISS_REASONS}
              onValueChange={(val) => setReason(val ?? "")}
            >
              <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                <SelectValue>
                  {(val) => getSelectOptionLabel(DISMISS_REASONS, val, "Select dismissal reason")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom">
                {DISMISS_REASONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Internal Dismissal Notes</FieldLabel>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide reason for closing report without enforcement..."
              className="min-h-20 text-xs rounded-lg resize-none"
            />
          </Field>
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
            onClick={handleSubmit}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg cursor-pointer"
          >
            Confirm Dismissal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
