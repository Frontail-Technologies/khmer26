"use client"

import { useLocale } from "next-intl"
import { intlLocaleFor, type Locale } from "@/i18n/config"

/** The `Intl` locale tag for the visitor's language, to pass to the formatters in `lib/formatters`. */
export function useIntlLocale(): string {
  return intlLocaleFor(useLocale() as Locale)
}
