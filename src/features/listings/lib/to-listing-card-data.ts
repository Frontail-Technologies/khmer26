import { getMediaUrl } from "@/lib/media/get-media-url"
import type { ListingCardData } from "@/types"
import type { PublicListing } from "../api/listings.api"

/** Adapts the backend listing summary to the shared card props. No field is invented. */
export function toListingCardData(listing: PublicListing): ListingCardData {
  const province = listing.location.province.nameEn
  const district = listing.location.district?.nameEn
  const imageUrl = getMediaUrl(listing.primaryImage?.r2Key)
  const hasPrice = listing.price !== null && listing.price !== ""

  return {
    id: listing.id,
    slug: listing.id,
    title: listing.title,
    price: hasPrice ? Number(listing.price) : 0,
    currency: listing.currency ?? "USD",
    priceOnRequest: !hasPrice,
    createdAt: listing.createdAt,
    isFavorited: listing.isFavorited,
    location: {
      province,
      district,
      label: district ? `${district}, ${province}` : province,
    },
    primaryImage: imageUrl
      ? { id: listing.primaryImage!.mediaId, url: imageUrl, alt: listing.title, isPrimary: true }
      : undefined,
  }
}
