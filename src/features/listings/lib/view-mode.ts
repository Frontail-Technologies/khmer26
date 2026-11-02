import type { ListingViewMode } from "../components/listing-view-toggle"

/** Cookie holding the visitor's grid/list choice, read on the server so the first HTML matches it. */
export const VIEW_MODE_COOKIE = "k26_view"

export function parseViewMode(value: string | null | undefined): ListingViewMode {
  return value === "list" ? "list" : "grid"
}
