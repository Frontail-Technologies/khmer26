/** "086225333" -> "086 225 333", "0887883333" -> "088 788 3333". Falls back to the raw value. */
export function formatPhone(value: string): string {
  const match = /^(\d{3})(\d{3})(\d+)$/.exec(value)
  return match ? `${match[1]} ${match[2]} ${match[3]}` : value
}

export const CARRIER_LABELS = {
  cellcard: "Cellcard",
  smart: "Smart",
  metfone: "Metfone",
} as const
