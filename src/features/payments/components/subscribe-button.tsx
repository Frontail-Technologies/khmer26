"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { usePaymentsAvailability, useStartCheckout } from "../api/payments.queries"

interface SubscribeButtonProps {
  planId: string
  price: number
  renew?: boolean
  className?: string
}

export function SubscribeButton({ planId, price, renew = false, className }: SubscribeButtonProps) {
  const t = useTranslations("payments.actions")
  const requireAuth = useRequireAuth()
  const payments = usePaymentsAvailability()
  const checkout = useStartCheckout()

  if (price <= 0) return null

  if (payments.isLoading) {
    return (
      <Button type="button" disabled className={className}>
        {t("starting")}
      </Button>
    )
  }

  if (!payments.isEnabled) {
    return (
      <Button type="button" disabled className={className}>
        {t("comingSoon")}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      className={className}
      disabled={checkout.isPending}
      onClick={() => requireAuth(() => checkout.mutate({ purpose: "subscription", planId }))}
    >
      {checkout.isPending ? t("starting") : renew ? t("renew") : t("subscribe")}
    </Button>
  )
}
