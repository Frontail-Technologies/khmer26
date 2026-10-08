import type { ListingDetail } from "../api/listing-detail.api"

/**
 * Product rule: the financing calculator is offered for these category families. It is matched
 * on the category ancestry (slugs), never on titles. A backend flag would be the better long-term home.
 */
export const LOAN_ELIGIBLE_ROOT_CATEGORY_SLUGS: readonly string[] = ["vehicles", "property"]

export function isLoanEligible(listing: Pick<ListingDetail, "price" | "category">): boolean {
  if (listing.price === null) return false
  const price = Number(listing.price)
  if (!Number.isFinite(price) || price <= 0) return false
  return listing.category.breadcrumb.some((crumb) => LOAN_ELIGIBLE_ROOT_CATEGORY_SLUGS.includes(crumb.slug))
}
