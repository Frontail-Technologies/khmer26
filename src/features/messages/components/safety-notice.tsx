"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { ShieldWarning, X, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function SafetyNotice() {
  const tGenerated = useTranslations("generated")
  const [dismissed, setDismissed] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)

  if (dismissed) return null

  return (
    <>
      <div className="mx-3 my-2 p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-xs flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldWarning size={16} weight="fill" className="text-accent shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-foreground text-xxs sm:text-xs">
              Stay safe on Khmer26:{" "}
            </span>
            <span className="text-xxs sm:text-xs text-muted-foreground truncate">
              <LocalizedText id="avoidAdvancePaymentsBeforeInPersonInspection" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setTipsOpen(true)}
            className="text-xxs font-bold text-primary hover:underline"
          >
            <LocalizedText id="tips" />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground p-0.5"
            aria-label={tGenerated("dismissSafetyNotice")}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
              <Info size={22} weight="bold" />
            </div>
            <DialogTitle className="text-lg font-bold">
              <LocalizedText id="marketplaceSafetyTips" />
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              <LocalizedText id="followTheseRecommendedPracticesForSafeTradingInCambodia" />
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block"><LocalizedText id="message1MeetInPublicLocations" /></span>
              <p><LocalizedText id="meetInBusyPublicAreasLikeShoppingMallsCafes" /></p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block"><LocalizedText id="message2InspectBeforePaying" /></span>
              <p><LocalizedText id="checkVehicleConditionOriginalRegistrationDocumentsAndElectronics" /></p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block"><LocalizedText id="message3UseBakongOrDirectBankTransfer" /></span>
              <p><LocalizedText id="payOnlyAfterReceivingAndVerifyingThePhysicalItem" /></p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTipsOpen(false)}
              className="text-xs font-semibold h-9.5 w-full sm:w-auto"
            >
              <LocalizedText id="gotIt" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
