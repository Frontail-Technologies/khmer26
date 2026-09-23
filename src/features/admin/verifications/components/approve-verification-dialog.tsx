"use client"

import { useState } from "react"
import { CheckCircle, ShieldCheck, SpinnerGap } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { VerificationRequest } from "../types"

interface ApproveVerificationDialogProps {
  request: VerificationRequest
  open: boolean
  onOpenChange: (open: boolean) => void
  onApproveSuccess?: () => void
}

export function ApproveVerificationDialog({
  request,
  open,
  onOpenChange,
  onApproveSuccess,
}: ApproveVerificationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onApproveSuccess?.()
      onOpenChange(false)
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
            <CheckCircle size={24} weight="fill" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Approve Seller Verification
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Grant verified merchant status and trust badge to this seller.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seller:</span>
              <span className="font-semibold text-foreground">{request.seller.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verification Type:</span>
              <span className="font-semibold capitalize text-foreground">{request.type} Verification</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Request ID:</span>
              <span className="font-mono text-foreground">{request.id}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Approving this request will mark the seller account as verified and display the Verified Badge on all of their marketplace listings.
          </p>
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
            onClick={handleApprove}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 rounded-lg cursor-pointer"
          >
            {isSubmitting ? (
              <SpinnerGap size={14} className="animate-spin" />
            ) : (
              <ShieldCheck size={15} weight="bold" />
            )}
            <span>Approve & Grant Badge</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
