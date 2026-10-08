import { getMediaUrl } from "@/lib/media/get-media-url"
import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import type { ListingDetail, ListingSpec } from "../api/listing-detail.api"

export function formatListingPrice(listing: Pick<ListingDetail, "price" | "currency">): string {
  if (listing.price === null || listing.price === "") return "Contact for price"
  return formatPriceWithCurrency(Number(listing.price), listing.currency ?? "USD")
}

/** Most specific level first, only the levels that exist. */
export function formatLocation(location: ListingDetail["location"]): string {
  return [location.commune?.nameEn, location.district?.nameEn, location.province.nameEn]
    .filter(Boolean)
    .join(", ")
}

export function formatSpecValue(spec: ListingSpec): string {
  switch (spec.fieldType) {
    case "select":
      return spec.valueLabelEn ?? String(spec.value)
    case "boolean":
      return spec.value ? "Yes" : "No"
    case "number":
      if (typeof spec.value !== "number") return String(spec.value)
      // Four-digit whole numbers stay ungrouped so values such as a year never read "2,022".
      return Number.isInteger(spec.value) && Math.abs(spec.value) < 10000
        ? String(spec.value)
        : spec.value.toLocaleString("en-US")
    default:
      return String(spec.value)
  }
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
}

/** Real media only, in backend order. Media that cannot be resolved to a URL is skipped. */
export function toGalleryImages(media: ListingDetail["media"], title: string): GalleryImage[] {
  return [...media]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((m, index) => {
      const url = getMediaUrl(m.r2Key)
      return url ? [{ id: m.id, url, alt: `${title} photo ${index + 1}` }] : []
    })
}

export function formatMemberSince(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date)
}

export function sellerTypeLabel(type: "individual" | "business" | "dealer"): string {
  return type === "individual" ? "Individual seller" : type === "dealer" ? "Dealer" : "Business"
}
