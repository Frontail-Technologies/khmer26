"use client"

import { useState } from "react"
import { CheckCircle, CurrencyDollar, PaperPlaneTilt } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface ListingMakeOfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingTitle: string
  askingPrice: number
  currency?: string
}

export function ListingMakeOfferDialog({
  open,
  onOpenChange,
  listingTitle,
  askingPrice,
  currency = "USD",
}: ListingMakeOfferDialogProps) {
  const [offerPrice, setOfferPrice] = useState<string>("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handlePreset = (percentage: number) => {
    const discounted = Math.round(askingPrice * (1 - percentage / 100))
    setOfferPrice(discounted.toString())
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSubmitted(false)
      setOfferPrice("")
      setMessage("")
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!offerPrice || Number(offerPrice) <= 0) return
    setSubmitted(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <CurrencyDollar size={22} weight="bold" />
            <DialogTitle>Make an Offer</DialogTitle>
          </div>
          <DialogDescription>
            Send a direct price proposal to the seller for &quot;{listingTitle}&quot;.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle size={28} weight="fill" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Offer Sent!</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                Your offer of ${Number(offerPrice).toLocaleString()} {currency} was submitted to the seller.
              </p>
            </div>
            <Button
              onClick={() => handleClose(false)}
              className="mt-2 h-9 text-xs font-semibold"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">Asking Price:</span>
              <span className="font-bold text-foreground">
                ${askingPrice.toLocaleString()} {currency}
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="offerAmount" className="text-xs sm:text-sm font-semibold text-foreground">
                Your Offer Price ($ {currency})
              </label>
              <Input
                id="offerAmount"
                type="number"
                min={1}
                placeholder="Enter offer amount"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="h-10 text-sm font-semibold"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Quick:</span>
              <button
                type="button"
                onClick={() => handlePreset(5)}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                -5% (${Math.round(askingPrice * 0.95).toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => handlePreset(10)}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                -10% (${Math.round(askingPrice * 0.9).toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => handlePreset(15)}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                -15% (${Math.round(askingPrice * 0.85).toLocaleString()})
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="offerMessage" className="text-xs sm:text-sm font-semibold text-foreground">
                Message to Seller (Optional)
              </label>
              <Input
                id="offerMessage"
                type="text"
                placeholder="e.g. Ready for quick pickup today"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-10 text-xs sm:text-sm"
              />
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
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                disabled={!offerPrice || Number(offerPrice) <= 0}
              >
                <PaperPlaneTilt size={16} weight="bold" />
                <span>Submit Offer</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
