"use client"

import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/config"
import { pickText } from "./pick-text"

/** `pickText` bound to the visitor's current language. */
export function useLocalizedText(): (en: string, km: string | null | undefined) => string {
  const locale = useLocale() as Locale
  return (en, km) => pickText(en, km, locale)
}
