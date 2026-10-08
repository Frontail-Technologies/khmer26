
export function resolveBannerDestination(
  type?: string | null,
  value?: string | null
): string | null {
  if (!value || !type || type === "no_action") return null
  if (type === "category") return `/category/${encodeURIComponent(value)}`
  if (type === "listing") return `/listing/${encodeURIComponent(value)}`
  if (value.startsWith("/") && !value.startsWith("//")) return value
  if (/^https:\/\//i.test(value)) return value
  return null
}
