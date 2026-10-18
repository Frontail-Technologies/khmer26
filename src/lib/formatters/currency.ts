/** `locale` is an Intl tag (see `intlLocaleFor` / `useIntlLocale`); it defaults to English. */
export function formatCurrency(amount: number, currency: string = "USD", locale: string = "en-US"): string {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)

  if (currency === "USD") {
    return `$${formatted}`
  }

  return `${formatted} ${currency}`
}

export function formatPriceWithCurrency(amount: number, currency: string = "USD", locale: string = "en-US"): string {
  const formatted = new Intl.NumberFormat(locale).format(amount)
  if (currency === "USD") {
    return `$${formatted}`
  }
  return `${formatted} ${currency}`
}

export function formatCompactPrice(amount: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount)
}
