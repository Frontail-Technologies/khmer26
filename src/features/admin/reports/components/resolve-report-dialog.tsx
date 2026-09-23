"use client"

import { useState } from "react"
import { CheckCircle } from "@phosphor-icons/react"
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

interface ResolveReportDialogProps {
  report: AdminReport
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RESOLUTION_OUTCOMES = [
  { value: "handled_listing", label: "Handled in Listing Moderation" },
  { value: "handled_user", label: "Handled in User Moderation" },
  { value: "no_violation", label: "No Violation Found / Policy Compliant" },
  { value: "content_removed", label: "Content Already Removed" },
  { value: "duplicate_case", label: "Duplicate Report Merged" },
  { value: "other", label: "Other Administrative Resolution" },
]

export function ResolveReportDialog({
  report,
  open,
  onOpenChange,
}: ResolveReportDialogProps) {
  const [outcome, setOutcome] = useState("handled_listing")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
            <CheckCircle size={22} weight="fill" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Resolve Report #{report.id}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Mark this community complaint case as resolved. Specify the operational outcome and internal findings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <Field>
            <FieldLabel required>Resolution Outcome</FieldLabel>
            <Select
              value={outcome}
              items={RESOLUTION_OUTCOMES}
              onValueChange={(val) => setOutcome(val ?? "")}
            >
              <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                <SelectValue>
                  {(val) => getSelectOptionLabel(RESOLUTION_OUTCOMES, val, "Select outcome")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom">
                {RESOLUTION_OUTCOMES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Moderation Resolution Notes</FieldLabel>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail the enforcement actions taken or reasons why case is concluded..."
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
            className="flex-1 sm:flex-initial h-9 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
          >
            Confirm Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
