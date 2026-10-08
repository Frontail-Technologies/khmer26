"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
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
import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import { createOffer, startConversation } from "../../api/listing-detail.api"
import { describeError } from "../../hooks/use-start-conversation"

interface ListingMakeOfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: string
  listingTitle: string
  askingPrice: number
  currency: "USD" | "KHR"
}

const PRESETS = [5, 10, 15]

export function ListingMakeOfferDialog({
  open,
  onOpenChange,
  listingId,
  listingTitle,
  askingPrice,
  currency,
}: ListingMakeOfferDialogProps) {
  const [offerPrice, setOfferPrice] = useState("")

  const amount = Number(offerPrice)
  const isValid = offerPrice.trim() !== "" && Number.isFinite(amount) && amount > 0

  const submit = useMutation({
    mutationFn: async () => {
      const conversation = await startConversation(listingId)
      await createOffer(conversation.id, { amount, currency })
    },
  })

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      submit.reset()
      setOfferPrice("")
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || submit.isPending) return
    submit.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <CurrencyDollar size={20} weight="bold" />
            <DialogTitle>Make an offer</DialogTitle>
          </div>
          <DialogDescription>
            Send your offer for &quot;{listingTitle}&quot;. Asking price:{" "}
            <strong>{formatPriceWithCurrency(askingPrice, currency)}</strong>
          </DialogDescription>
        </DialogHeader>

        {submit.isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle size={28} weight="fill" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Offer sent</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                Your offer of {formatPriceWithCurrency(amount, currency)} was sent to the seller.
              </p>
            </div>
            <Button onClick={() => handleClose(false)} className="mt-2 h-9 text-xs font-semibold">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="offer-amount" className="text-xs font-semibold text-foreground">
                Your offer ({currency})
              </label>
              <Input
                id="offer-amount"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder={`e.g. ${Math.round(askingPrice * 0.9)}`}
                className="h-10"
              />
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((percentage) => (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => setOfferPrice(String(Math.round(askingPrice * (1 - percentage / 100))))}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {percentage}% off
                  </button>
                ))}
              </div>
            </div>

            {submit.isError && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {describeError(submit.error, "Couldn't send your offer. Please try again.")}
              </p>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || submit.isPending} className="gap-1.5">
                <PaperPlaneTilt size={16} weight="bold" />
                {submit.isPending ? "Sending…" : "Send Offer"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
