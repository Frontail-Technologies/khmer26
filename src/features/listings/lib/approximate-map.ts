export type MapPrecision = "commune" | "district" | "province"

/** Wide, administrative-level views only: never street or house level. */
export const MAP_ZOOM: Record<MapPrecision, number> = {
  commune: 13,
  district: 11,
  province: 8.5,
}

/** Radius of the "approximate area" circle drawn around the area's centre. */
export const MAP_AREA_RADIUS_M: Record<MapPrecision, number> = {
  commune: 1200,
  district: 4000,
  province: 20000,
}

export const DEFAULT_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'

export function getTileUrl(): string {
  return process.env.NEXT_PUBLIC_MAP_TILE_URL || DEFAULT_TILE_URL
}

/** Closed GeoJSON ring approximating a circle (good enough at these radii). */
export function circleRing(
  latitude: number,
  longitude: number,
  radiusMeters: number,
  steps = 64
): [number, number][] {
  const earth = 6378137
  const dLat = (radiusMeters / earth) * (180 / Math.PI)
  const dLon = dLat / Math.cos((latitude * Math.PI) / 180)
  const ring: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    ring.push([longitude + dLon * Math.cos(angle), latitude + dLat * Math.sin(angle)])
  }
  return ring
}
