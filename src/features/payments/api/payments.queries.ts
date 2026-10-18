"use client"

import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { usePublicSettings } from "@/features/settings/api/public-settings"
import { createCheckout } from "./payments.api"

export function usePaymentsAvailability() {
  const settings = usePublicSettings()
  return {
    isEnabled: settings.data?.paymentsEnabled === true,
    isLoading: settings.isPending,
  }
}

export function useCheckoutErrorMessage() {
  const t = useTranslations("payments.errors")
  return (error: unknown): string => {
    const code = error instanceof ApiError ? readCode(error) : null
    switch (code) {
      case "PAYMENTS_NOT_AVAILABLE":
        return t("PAYMENTS_NOT_AVAILABLE")
      case "PAYMENT_PROVIDER_UNAVAILABLE":
        return t("PAYMENT_PROVIDER_UNAVAILABLE")
      case "PAYMENT_PROVIDER_NOT_CONNECTED":
        return t("PAYMENT_PROVIDER_NOT_CONNECTED")
      case "LISTING_NOT_ELIGIBLE":
        return t("LISTING_NOT_ELIGIBLE")
      case "PAYMENT_NOT_REQUIRED":
        return t("PAYMENT_NOT_REQUIRED")
      case "PAYMENT_CONFLICT":
        return t("PAYMENT_CONFLICT")
      default:
        return t("generic")
    }
  }
}

function readCode(error: ApiError): string {
  const details = error.details as { code?: unknown } | undefined
  return typeof details?.code === "string" ? details.code : error.code
}

export function useStartCheckout() {
  const errorMessage = useCheckoutErrorMessage()

  return useMutation({
    mutationFn: createCheckout,
    onSuccess: (payment) => {
      if (!payment.checkoutUrl) {
        toast.error(
          errorMessage(
            new ApiError(503, {
              code: "PAYMENT_PROVIDER_UNAVAILABLE",
              message: "The hosted payment page is unavailable",
            })
          )
        )
        return
      }
      window.location.assign(payment.checkoutUrl)
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
}
