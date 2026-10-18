"use client"

import { useTranslations } from "next-intl"
import { CurrencyDollar } from "@phosphor-icons/react"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSubscriptionPlans } from "@/features/account/subscription/api/subscription.queries"
import { PlanCard } from "./plan-card"

export function PricingView() {
  const t = useTranslations("payments.pricing")
  const tCommon = useTranslations("common")
  const plans = useSubscriptionPlans()

  if (plans.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  if (plans.isError) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{t("loadError")}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => plans.refetch()}>
          {tCommon("tryAgain")}
        </Button>
      </div>
    )
  }

  const items = plans.data ?? []
  if (items.length === 0) {
    return <EmptyState icon={<CurrencyDollar size={32} aria-hidden="true" />} title={t("empty")} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((plan, index) => (
        <PlanCard key={plan.id} plan={plan} popular={index === 1} />
      ))}
    </div>
  )
}
