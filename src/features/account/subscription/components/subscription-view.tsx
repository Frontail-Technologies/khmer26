"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AccountPageHeader } from "@/features/account/components/account-page-header"
import { useSubscriptionHistory, useSubscriptionPlans, useSubscriptionUsage } from "../api/subscription.queries"
import { CurrentPlanCard } from "./current-plan-card"
import { PlanBenefits } from "./plan-benefits"
import { SubscriptionHistory } from "./subscription-history"

export function SubscriptionView() {
  const tGenerated = useTranslations("generated")
  const usage = useSubscriptionUsage()
  const plans = useSubscriptionPlans()
  const history = useSubscriptionHistory()
  const isLoading = usage.isLoading || plans.isLoading || history.isLoading
  const error = usage.error || plans.error || history.error

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-14" /><Skeleton className="h-48" /><div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div></div>
  }
  if (error || !usage.data) {
    return <div className="rounded-lg border bg-card p-8 text-center"><h2 className="font-bold"><LocalizedText id="subscriptionDetailsCouldNotBeLoaded" /></h2><p className="mt-1 text-sm text-muted-foreground">{error instanceof Error ? error.message : tGenerated("pleaseTryAgain")}</p><Button className="mt-4" variant="outline" onClick={() => { usage.refetch(); plans.refetch(); history.refetch() }}><LocalizedText id="tryAgain" /></Button></div>
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader title={tGenerated("subscriptionPlans")} />
      <CurrentPlanCard usage={usage.data} />
      <PlanBenefits plans={plans.data ?? []} currentPlanId={usage.data.plan.id} />
      <SubscriptionHistory items={history.data ?? []} />
    </div>
  )
}
