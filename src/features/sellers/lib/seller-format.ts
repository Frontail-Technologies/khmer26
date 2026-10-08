export function sellerInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => Array.from(w)[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  )
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function formatReviewDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

/** Share of reviews at one star level, rounded; derived only from real counts. */
export function distributionPercent(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 100) : 0
}
