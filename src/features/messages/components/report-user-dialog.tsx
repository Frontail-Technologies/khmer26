"use client"

import { useState, type FormEvent } from "react"
import { Flag, CheckCircle } from "@phosphor-icons/react"
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import type { ConversationParticipant } from "../types"

interface ReportUserDialogProps {
  participant: ConversationParticipant
  open: boolean
  onOpenChange: (open: boolean) => void
}

const REPORT_REASONS = [
  { value: "fraud", label: "Scam or Fraudulent Activity" },
  { value: "harassment", label: "Harassment or Abusive Behavior" },
  { value: "suspicious", label: "Suspicious Payment / Link Request" },
  { value: "spam", label: "Commercial Spam or Irrelevant Promotion" },
  { value: "counterfeit", label: "Counterfeit or Stolen Item" },
  { value: "other", label: "Other Policy Violation" },
]

export function ReportUserDialog({
  participant,
  open,
  onOpenChange,
}: ReportUserDialogProps) {
  const [reason, setReason] = useState("fraud")
  const [details, setDetails] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setDetails("")
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <Flag size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Report {participant.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Our trust & safety team reviews reports within 24 hours to keep the marketplace secure.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
              <CheckCircle size={32} weight="fill" />
            </div>
            <p className="text-sm font-bold text-foreground">Report Received</p>
            <p className="text-xs text-muted-foreground">
              Thank you for helping keep Khmer26 safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Reason for Report
              </label>
              <Select value={reason} onValueChange={(val) => setReason(val as string)}>
                <SelectTrigger className="h-10 text-xs bg-background">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="text-xs">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Additional Details (Optional)
              </label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any additional context or evidence..."
                rows={3}
                className="text-xs bg-background resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-xs font-semibold h-9.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="text-xs font-bold h-9.5"
              >
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
