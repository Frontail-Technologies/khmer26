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
import type { AdminListing } from "../types"

interface ApproveListingDialogProps {
  listing: AdminListing
  open: boolean
  onOpenChange: (open: boolean) => void
  onApproveSuccess?: () => void
}

export function ApproveListingDialog({
  listing,
  open,
  onOpenChange,
  onApproveSuccess,
}: ApproveListingDialogProps) {
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
            <ShieldCheck size={24} weight="fill" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Approve & Publish Listing
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            You are approving <span className="font-semibold text-foreground">&ldquo;{listing.title}&rdquo;</span> submitted by <span className="font-semibold text-foreground">{listing.seller.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Listing ID</span>
              <span className="font-mono font-bold text-foreground">{listing.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{listing.categoryName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-bold font-mono text-foreground">
                {listing.currency === "USD" ? `$${listing.price.toLocaleString("en-US")}` : `${listing.price.toLocaleString("en-US")} KHR`}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs leading-snug">
            <CheckCircle size={16} className="shrink-0 mt-0.5" weight="fill" />
            <span>
              Approving will immediately index this listing in search results and notify the seller.
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
            onClick={handleApprove}
            className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 rounded-lg cursor-pointer"
          >
            {isSubmitting ? (
              <SpinnerGap size={14} className="animate-spin" />
            ) : (
              <CheckCircle size={15} weight="bold" />
            )}
            <span>Approve Listing</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
