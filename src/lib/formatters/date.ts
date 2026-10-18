function parseDate(value?: string | Date | null): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(dateString: string, locale: string = "en-US"): string {
  try {
    const date = parseDate(dateString)
    if (!date) return "—"
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  } catch {
    return dateString
  }
}

const ADMIN_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" })
const ADMIN_TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

/** Admin date such as "22 June 2020". */
export function formatAdminDate(value?: string | Date | null): string {
  const date = parseDate(value)
  return date ? ADMIN_DATE_FORMAT.format(date) : "—"
}

/** Admin timestamp such as "22 June 2020, 3:45 PM". */
export function formatAdminDateTime(value?: string | Date | null): string {
  const date = parseDate(value)
  return date ? `${ADMIN_DATE_FORMAT.format(date)}, ${ADMIN_TIME_FORMAT.format(date)}` : "—"
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseDate(dateString)
    if (!date) return "—"
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return formatDate(dateString)
  } catch {
    return dateString
  }
}

/** Compact age such as "38m", "5h", "1d", "3w", "2mo", "1y". */
export function formatCompactRelativeTime(dateString: string): string {
  const date = parseDate(dateString)
  if (!date) return "—"
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return "now"
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  if (days < 30) return `${Math.floor(days / 7)}w`
  if (days < 365) return `${Math.floor(days / 30)}mo`
  return `${Math.floor(days / 365)}y`
}
