"use client"

import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/config"

interface NamedInBothLanguages {
  nameEn: string
  nameKm?: string | null
}

interface LabelledInBothLanguages {
  labelEn: string
  labelKm?: string | null
}

/** Category / province / district names come in both languages; use Khmer when asked and present. */
export function localizedName(item: NamedInBothLanguages, locale: Locale): string {
  const km = item.nameKm?.trim()
  return locale === "km" && km ? km : item.nameEn
}

export function localizedLabel(item: LabelledInBothLanguages, locale: Locale): string {
  const km = item.labelKm?.trim()
  return locale === "km" && km ? km : item.labelEn
}

/** Same, bound to the visitor's current language. */
export function useLocalizedName(): (item: NamedInBothLanguages) => string {
  const locale = useLocale() as Locale
  return (item) => localizedName(item, locale)
}

export function useLocalizedLabel(): (item: LabelledInBothLanguages) => string {
  const locale = useLocale() as Locale
  return (item) => localizedLabel(item, locale)
}
