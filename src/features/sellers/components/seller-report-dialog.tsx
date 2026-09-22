"use client"

import { useState } from "react"
import { CheckCircle, Flag } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface SellerReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sellerName: string
}

const REPORT_REASONS = [
  "Suspected scammer or fraudulent activity",
  "Fake identity or impersonation",
  "Abusive language or harassment",
  "Selling prohibited or counterfeit items",
  "Unresponsive or repeatedly canceling deals",
  "Other policy violation",
]

export function SellerReportDialog({
  open,
  onOpenChange,
  sellerName,
}: SellerReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSubmitted(false)
      setSelectedReason("")
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return
    setSubmitted(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Flag size={20} weight="bold" />
            <DialogTitle>Report Seller</DialogTitle>
          </div>
          <DialogDescription>
            Help keep the Khmer26 community safe. Select the reason you are reporting &quot;{sellerName}&quot;.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle size={28} weight="fill" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Report Submitted</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                Thank you for notifying us. Our team will review this seller account.
              </p>
            </div>
            <Button
              onClick={() => handleClose(false)}
              className="mt-2 h-9 text-xs font-semibold"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => {
                const isSelected = selectedReason === reason
                return (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="seller-report-reason"
                      value={reason}
                      checked={isSelected}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-primary"
                    />
                    <span>{reason}</span>
                  </label>
                )
              })}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!selectedReason}
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
