export const LOCALES = ["en", "km"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

/** Cookie that remembers the visitor's language (no URL prefix: routes stay the same in both languages). */
export const LOCALE_COOKIE = "NEXT_LOCALE"
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}

/**
 * BCP-47 tag for `Intl` formatting. Khmer keeps Latin digits (`-u-nu-latn`): prices, phone numbers
 * and dates stay unambiguous next to the Latin digits in listing data and receipts.
 */
export function intlLocaleFor(locale: Locale): string {
  return locale === "km" ? "km-KH-u-nu-latn" : "en-US"
}
