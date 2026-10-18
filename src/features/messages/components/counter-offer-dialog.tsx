"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, type FormEvent } from "react"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CounterOfferDialogProps {
  open: boolean
  currency: string
  initialAmount: number
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (amount: number) => void
}

export function CounterOfferDialog({ open, currency, initialAmount, isSubmitting, onOpenChange, onSubmit }: CounterOfferDialogProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const [value, setValue] = useState(String(initialAmount))
  const [error, setError] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount greater than zero.")
      return
    }
    onSubmit(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1"><ArrowCounterClockwise size={21} weight="bold" /></div>
          <DialogTitle><LocalizedText id="counterOffer" /></DialogTitle>
          <DialogDescription>{tDynamic("revisedAmountCurrency", { currency })}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold"><LocalizedText id="counterAmount" /></label>
            <Input type="number" min="0.01" step="0.01" value={value} onChange={(event) => { setValue(event.target.value); setError("") }} autoFocus />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}><LocalizedText id="cancel" /></Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? tGenerated("sending") : tGenerated("sendCounter")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
