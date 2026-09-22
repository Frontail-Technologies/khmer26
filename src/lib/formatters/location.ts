export interface LocationInput {
  province?: string
  district?: string
  label?: string
}

export function formatListingLocation(loc: LocationInput | string | undefined): string {
  if (!loc) return "Cambodia"
  if (typeof loc === "string") return loc
  if (loc.label) return loc.label
  if (loc.district && loc.province) return `${loc.district}, ${loc.province}`
  if (loc.province) return loc.province
  return "Cambodia"
}
