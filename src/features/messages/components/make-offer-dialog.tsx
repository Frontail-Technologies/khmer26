"use client"

import { useState, type FormEvent } from "react"
import { Tag } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ConversationListing } from "../types"

interface MakeOfferDialogProps {
  listing: ConversationListing
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitOffer: (amount: number, message?: string) => void
}

export function MakeOfferDialog({
  listing,
  open,
  onOpenChange,
  onSubmitOffer,
}: MakeOfferDialogProps) {
  const [offerAmount, setOfferAmount] = useState(
    listing.price > 0 ? String(Math.round(listing.price * 0.9)) : ""
  )
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handlePreset = (percentage: number) => {
    const discounted = Math.round(listing.price * (1 - percentage / 100))
    setOfferAmount(String(discounted))
    setError("")
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const amount = Number(offerAmount)
    if (!amount || amount <= 0) {
      setError("Please enter a valid offer amount")
      return
    }
    if (amount >= listing.price) {
      setError("Offer amount should be lower than asking price")
      return
    }

    onSubmitOffer(amount, message.trim() || undefined)
    onOpenChange(false)
    setMessage("")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent mb-1">
            <Tag size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Make a Price Offer
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Submit a binding counter-offer for &quot;{listing.title}&quot;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold">Asking Price</span>
            <span className="text-base font-black text-foreground">
              ${listing.price.toLocaleString()} {listing.currency}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Your Offer Amount ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                value={offerAmount}
                onChange={(e) => {
                  setOfferAmount(e.target.value)
                  setError("")
                }}
                placeholder="Enter offer amount"
                className="pl-7 h-10 text-sm font-bold bg-background"
                required
              />
            </div>
            {error && (
              <p className="text-xs font-semibold text-destructive mt-1">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Quick offer:
            </span>
            {[5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePreset(pct)}
                className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-bold text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                -{pct}% (${Math.round(listing.price * (1 - pct / 100)).toLocaleString()})
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Note to Seller (Optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Can pick up this weekend with full cash payment..."
              rows={2}
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
              className="text-xs font-bold h-9.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Offer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
