"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
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
import { reportListing } from "../../api/listing-detail.api"
import { useReportReasons } from "../../api/listing-detail.queries"
import { describeError } from "../../hooks/use-start-conversation"

interface ListingReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: string
  listingTitle: string
}

export function ListingReportDialog({
  open,
  onOpenChange,
  listingId,
  listingTitle,
}: ListingReportDialogProps) {
  const [reasonId, setReasonId] = useState("")
  const [details, setDetails] = useState("")
  const reasons = useReportReasons(open)

  const report = useMutation({
    mutationFn: () =>
      reportListing(listingId, { reasonId, ...(details.trim() ? { details: details.trim() } : {}) }),
  })

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      report.reset()
      setReasonId("")
      setDetails("")
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reasonId || report.isPending) return
    report.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Flag size={20} weight="bold" />
            <DialogTitle>Report this listing</DialogTitle>
          </div>
          <DialogDescription>
            Help us maintain a safe marketplace. Select the reason you are reporting &quot;{listingTitle}&quot;.
          </DialogDescription>
        </DialogHeader>

        {report.isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle size={28} weight="fill" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Report Received</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                Thank you. Our moderation team will review this listing.
              </p>
            </div>
            <Button onClick={() => handleClose(false)} className="mt-2 h-9 text-xs font-semibold">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {reasons.isPending ? (
              <p className="text-xs text-muted-foreground">Loading reasons…</p>
            ) : reasons.isError ? (
              <div className="space-y-2">
                <p className="text-xs text-destructive">Couldn&apos;t load the report reasons.</p>
                <Button type="button" size="sm" variant="outline" onClick={() => reasons.refetch()}>
                  Try again
                </Button>
              </div>
            ) : reasons.data.length === 0 ? (
              <p className="text-xs text-muted-foreground">Reporting is currently unavailable.</p>
            ) : (
              <div className="space-y-2" role="radiogroup" aria-label="Report reason">
                {reasons.data.map((reason) => {
                  const isSelected = reasonId === reason.id
                  return (
                    <label
                      key={reason.id}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={reason.id}
                        checked={isSelected}
                        onChange={() => setReasonId(reason.id)}
                        className="mt-0.5 accent-primary"
                      />
                      <span>
                        {reason.label}
                        {reason.description && (
                          <span className="block text-[11px] font-normal text-muted-foreground">
                            {reason.description}
                          </span>
                        )}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="Additional details (optional)"
              aria-label="Additional details"
              className="w-full resize-none rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {report.isError && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {describeError(report.error, "Couldn't submit your report. Please try again.")}
              </p>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={!reasonId || report.isPending}>
                {report.isPending ? "Submitting…" : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
