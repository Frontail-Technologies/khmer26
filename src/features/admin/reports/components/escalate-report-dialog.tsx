"use client"

import { useState } from "react"
import { ShieldWarning } from "@phosphor-icons/react"
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

interface EscalateReportDialogProps {
  report: AdminReport
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ESCALATION_TARGETS = [
  { value: "listing_moderation", label: "Specialized Listing Moderation Team" },
  { value: "user_safety", label: "User Identity & Safety Unit" },
  { value: "chat_investigation", label: "Reported Chats Investigation" },
  { value: "senior_moderator", label: "Senior Lead Moderator Review" },
  { value: "legal_compliance", label: "Platform Legal & Compliance" },
]

export function EscalateReportDialog({
  report,
  open,
  onOpenChange,
}: EscalateReportDialogProps) {
  const [targetTeam, setTargetTeam] = useState("listing_moderation")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-1">
            <ShieldWarning size={22} weight="bold" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Escalate Report #{report.id}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Reassign this case to a specialized moderation unit for expedited investigation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <Field>
            <FieldLabel required>Escalation Destination</FieldLabel>
            <Select
              value={targetTeam}
              items={ESCALATION_TARGETS}
              onValueChange={(val) => setTargetTeam(val ?? "")}
            >
              <SelectTrigger size="sm" className="h-9.5 text-xs rounded-lg">
                <SelectValue>
                  {(val) => getSelectOptionLabel(ESCALATION_TARGETS, val, "Select destination team")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom">
                {ESCALATION_TARGETS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Escalation Reason & Notes</FieldLabel>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Highlight critical risk flags, financial impact, or policy references..."
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
            className="flex-1 sm:flex-initial h-9 px-4 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-lg cursor-pointer"
          >
            Confirm Escalation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
