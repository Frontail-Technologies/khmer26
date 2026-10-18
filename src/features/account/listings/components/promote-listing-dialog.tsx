"use client"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Sparkle, Star, Lightning, Info } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formatters/currency"
import { useIntlLocale } from "@/lib/i18n/use-intl-locale"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { usePaymentsAvailability, useStartCheckout } from "@/features/payments/api/payments.queries"
import type { AccountListingItem } from "../../types"
import { usePromotionPackages } from "../api/account-listings.queries"
import { useApplyListingPromotion } from "../api/account-listings.mutations"
import { useSubscriptionUsage } from "../../subscription/api/subscription.queries"
import type { PromotionType } from "../api/account-listings.api"

interface PromoteListingDialogProps {
  listing: AccountListingItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PROMOTION_ICONS = {
  featured: Sparkle,
  top_listing: Star,
  urgent: Lightning,
} satisfies Record<PromotionType, typeof Sparkle>

export function PromoteListingDialog({
  listing,
  open,
  onOpenChange,
}: PromoteListingDialogProps) {
  const tGenerated = useTranslations("generated")
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const packagesQuery = usePromotionPackages()
  const usageQuery = useSubscriptionUsage()
  const applyPromotion = useApplyListingPromotion()
  const startCheckout = useStartCheckout()
  const payments = usePaymentsAvailability()
  const requireAuth = useRequireAuth()
  const t = useTranslations("payments.promote")
  const tDynamic = useTranslations("dynamic")
  const locale = useIntlLocale()
  const localized = useLocalizedText()

  if (!listing) return null

  const packages = packagesQuery.data ?? []
  const selectedPackage = packages.find((item) => item.id === selectedPackageId) ?? packages[0]
  const remainingCredits = selectedPackage?.promotionType === "featured"
    ? usageQuery.data?.remainingFeaturedCredits ?? 0
    : selectedPackage?.promotionType === "top_listing"
      ? usageQuery.data?.remainingBumpCredits ?? 0
      : 0
  const canActivate = Boolean(selectedPackage && remainingCredits > 0)
  const canPay = Boolean(selectedPackage && !canActivate && payments.isEnabled && Number(selectedPackage.price) > 0)

  const handleActivate = () => {
    if (!selectedPackage || !canActivate) return
    applyPromotion.mutate(
      { listingId: listing.id, packageId: selectedPackage.id },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const handlePay = () => {
    if (!selectedPackage || !canPay) return
    requireAuth(() =>
      startCheckout.mutate({ purpose: "promotion", listingId: listing.id, packageId: selectedPackage.id })
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent mb-1">
            <Sparkle size={22} weight="fill" />
          </div>
          <DialogTitle className="text-lg font-bold">
            <LocalizedText id="promoteListing" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {(packagesQuery.isLoading || usageQuery.isLoading) && (
            <div className="space-y-2" aria-label={tGenerated("loadingPromotionPackages")}>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {(packagesQuery.isError || usageQuery.isError) && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <LocalizedText id="promotionOptionsCouldNotBeLoaded" />
            </div>
          )}

          {!packagesQuery.isLoading && !packagesQuery.isError && packages.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
              <LocalizedText id="noPromotionPackagesAreCurrentlyAvailable" />
            </div>
          )}

          {packages.map((option) => {
            const Icon = PROMOTION_ICONS[option.promotionType]
            const isSelected = selectedPackage?.id === option.id
            const optionCredits = option.promotionType === "featured"
              ? usageQuery.data?.remainingFeaturedCredits ?? 0
              : option.promotionType === "top_listing"
                ? usageQuery.data?.remainingBumpCredits ?? 0
                : 0

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedPackageId(option.id)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 select-none",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon size={20} weight={isSelected ? "fill" : "regular"} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {localized(option.name, option.nameKm)}
                    </span>
                    <span className="font-black text-sm text-primary">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: option.currency,
                      }).format(Number(option.price))}{" "}
                      <span className="text-xxs font-normal text-muted-foreground">
                        / {tDynamic("durationDays", { count: option.durationDays })}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {option.description ? localized(option.description, option.descriptionKm) : "Increase this listing's visibility across the marketplace."}
                  </p>
                  <p className={cn(
                    "mt-1.5 text-xxs font-semibold",
                    optionCredits > 0 ? "text-primary" : "text-muted-foreground"
                  )}>
                    {option.promotionType === "urgent"
                      ? tGenerated("paidActivationRequired")
                      : `${optionCredits} plan credit${optionCredits === 1 ? "" : "s"} remaining`}
                  </p>
                </div>
              </button>
            )
          })}

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/60 border border-border/60 text-xs text-muted-foreground">
            <Info size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="leading-normal">
              {payments.isLoading
                ? t("checkingAvailability")
                : payments.isEnabled
                ? t("payHint")
                : "Plan credits activate immediately. Paid promotions will be available soon."}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold h-10"
          >
            <LocalizedText id="close" />
          </Button>
          {canPay ? (
            <Button
              type="button"
              disabled={startCheckout.isPending}
              onClick={handlePay}
              className="text-xs font-semibold h-10 bg-primary text-primary-foreground"
            >
              {t("payAndPromote", { amount: formatCurrency(Number(selectedPackage?.price ?? 0), selectedPackage?.currency, locale) })}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canActivate || applyPromotion.isPending}
              onClick={handleActivate}
              className="text-xs font-semibold h-10 bg-primary text-primary-foreground"
            >
              {applyPromotion.isPending
                ? tGenerated("activating")
                : canActivate
                  ? t("useCredit")
                  : "No Credit Available"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
