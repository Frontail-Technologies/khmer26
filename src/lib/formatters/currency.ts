export function formatCurrency(amount: number, currency: string = "USD"): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)

  if (currency === "USD") {
    return `$${formatted}`
  }

  return `${formatted} ${currency}`
}

export function formatPriceWithCurrency(amount: number, currency: string = "USD"): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount)
  if (currency === "USD") {
    return `$${formatted}`
  }
  return `${formatted} ${currency}`
}

export function formatCompactPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount)
}
