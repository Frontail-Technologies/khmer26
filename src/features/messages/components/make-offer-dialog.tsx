"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

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
  isSubmitting?: boolean
}

export function MakeOfferDialog({
  listing,
  open,
  onOpenChange,
  onSubmitOffer,
  isSubmitting = false,
}: MakeOfferDialogProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent mb-1">
            <Tag size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            <LocalizedText id="makeAPriceOffer" />
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {tDynamic("counterOfferFor", { title: listing.title })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold"><LocalizedText id="askingPrice" /></span>
            <span className="text-base font-black text-foreground">
              ${listing.price.toLocaleString()} {listing.currency}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              <LocalizedText id="yourOfferAmountUsd" />
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
                placeholder={tGenerated("enterOfferAmount")}
                className="pl-7 h-10 text-sm font-bold bg-background"
                required
              />
            </div>
            {error && (
              <p className="text-xs font-semibold text-destructive mt-1">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xxs font-semibold text-muted-foreground">
              <LocalizedText id="quickOffer" />
            </span>
            {[5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePreset(pct)}
                className="px-2.5 py-1 rounded-lg bg-muted text-xxs font-bold text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                -{pct}% (${Math.round(listing.price * (1 - pct / 100)).toLocaleString()})
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              <LocalizedText id="noteToSellerOptional" />
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={tGenerated("eGCanPickUpThisWeekendWithFull")}
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
              <LocalizedText id="cancel" />
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-bold h-9.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? tGenerated("submitting_46a1a6") : tGenerated("submitOffer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
