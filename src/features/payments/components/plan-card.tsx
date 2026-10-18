"use client"

import { useTranslations } from "next-intl"
import { Buildings, CheckCircle, Sparkle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters/currency"
import { useIntlLocale } from "@/lib/i18n/use-intl-locale"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"
import type { SubscriptionPlan } from "@/features/account/subscription/api/subscription.api"
import { SubscribeButton } from "./subscribe-button"

export function PlanCard({ plan, popular = false, renew = false }: { plan: SubscriptionPlan; popular?: boolean; renew?: boolean }) {
  const t = useTranslations("payments.pricing")
  const locale = useIntlLocale()
  const localized = useLocalizedText()
  const price = Number(plan.price ?? 0)

  return (
    <Card className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
      <div className="space-y-4">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {popular ? <Sparkle size={20} weight="fill" className="text-accent" /> : <Buildings size={20} weight="fill" className="text-primary" />}
              <CardTitle className="text-base font-bold">{localized(plan.name, plan.nameKm)}</CardTitle>
            </div>
            {popular && (
              <Badge variant="outline" className="border-accent/30 bg-accent/15 text-2xs font-bold text-accent">
                {t("popular")}
              </Badge>
            )}
          </div>
          <p className="pt-2 text-2xl font-black">
            {formatCurrency(price, plan.currency, locale)}
            {plan.billingInterval && (
              <span className="text-xs font-normal text-muted-foreground"> {t("perInterval", { interval: plan.billingInterval })}</span>
            )}
          </p>
          {plan.description && <CardDescription className="pt-1 text-xs">{localized(plan.description, plan.descriptionKm)}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-2 border-t p-0 pt-3">
          <Feature text={plan.maxListings === null ? t("unlimitedListings") : t("listings", { count: plan.maxListings })} />
          <Feature text={t("featuredCredits", { count: plan.featuredCredits })} />
          <Feature text={t("bumpCredits", { count: plan.bumpCredits })} />
        </CardContent>
      </div>
      <SubscribeButton planId={plan.id} price={price} renew={renew} className="mt-5 min-h-10 w-full whitespace-normal" />
    </Card>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <CheckCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-primary" />
      <span>{text}</span>
    </div>
  )
}
