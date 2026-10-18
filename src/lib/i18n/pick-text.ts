import type { Locale } from "@/i18n/config"

/** Khmer text when asked for and present, otherwise the English original. Safe on server and client. */
export function pickText(en: string, km: string | null | undefined, locale: Locale): string {
  const khmer = km?.trim()
  return locale === "km" && khmer ? khmer : en
}
