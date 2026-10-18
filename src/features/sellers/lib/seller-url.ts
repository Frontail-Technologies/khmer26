import { SITE } from "@/lib/constants/site"

/** Product-style profile address for display ("khmer26.com/seller/<id>"); links keep the real origin. */
export function sellerProfileDisplayUrl(sellerId: string): string {
  let host = "khmer26.com"
  try {
    host = new URL(SITE.url).host
  } catch {
    // keep the product host
  }
  return `${host}/seller/${sellerId}`
}
