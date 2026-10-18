import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import { CheckCircle, Crown } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters/currency"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"
import type { SubscriptionUsage } from "../api/subscription.api"

export function CurrentPlanCard({ usage }: { usage: SubscriptionUsage }) {
  const tGenerated = useTranslations("generated")
  const localized = useLocalizedText()
  const price = Number(usage.plan.price ?? 0)
  const interval = usage.plan.billingInterval ? ` / ${usage.plan.billingInterval}` : ""
  const features = [
    usage.activeListingLimit === null
      ? `${usage.activeListings} active listings with no fixed limit`
      : `${usage.activeListings} of ${usage.activeListingLimit} active listing slots used`,
    usage.featuredCredits > 0 ? `${usage.remainingFeaturedCredits} of ${usage.featuredCredits} featured credits remaining` : null,
    usage.bumpCredits > 0 ? `${usage.remainingBumpCredits} of ${usage.bumpCredits} bump credits remaining` : null,
  ].filter((feature): feature is string => feature !== null)

  return (
    <Card className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-2xs sm:p-6">
      <CardContent className="space-y-4 p-0">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Crown size={24} weight="fill" /></div>
            <div><div className="flex items-center gap-2"><h2 className="text-lg font-bold">{localized(usage.plan.name, usage.plan.nameKm)}</h2><Badge variant="outline" className="border-primary/30 bg-primary/15 text-xxs font-bold text-primary"><LocalizedText id="active" /></Badge></div><p className="mt-0.5 text-xs text-muted-foreground">{usage.plan.description ? localized(usage.plan.description, usage.plan.descriptionKm) : "Current seller membership"}</p></div>
          </div>
          <div className="sm:text-right"><p className="text-2xl font-black">{formatCurrency(price, usage.plan.currency)}<span className="text-xs font-normal text-muted-foreground">{interval}</span></p><p className="text-xxs text-muted-foreground">{usage.expiresAt ? `Renews or expires ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(usage.expiresAt))}` : tGenerated("noExpirationDate")}</p></div>
        </div>
        <div className="grid gap-2 border-t border-primary/15 pt-4 text-xs sm:grid-cols-2">
          {features.map((feature) => <div key={feature} className="flex items-center gap-2"><CheckCircle size={15} weight="fill" className="shrink-0 text-primary" /><span>{feature}</span></div>)}
        </div>
      </CardContent>
    </Card>
  )
}
