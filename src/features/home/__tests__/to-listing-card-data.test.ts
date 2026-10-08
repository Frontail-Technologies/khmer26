import { describe, expect, it, vi } from "vitest"
import { makeListing } from "./fixtures"

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({ getMediaUrl: (k: string | null | undefined) => getMediaUrl(k) }))

import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"

describe("toListingCardData", () => {
  it("maps real backend fields and resolves the image through the media resolver", () => {
    const card = toListingCardData(makeListing())
    expect(getMediaUrl).toHaveBeenCalledWith("listings/dream.jpg")
    expect(card.title).toBe("Backend Honda Dream")
    expect(card.price).toBe(1250)
    expect(card.currency).toBe("USD")
    expect(card.priceOnRequest).toBe(false)
    expect(card.location.label).toBe("Chamkar Mon, Phnom Penh")
    expect(card.primaryImage?.url).toBe("https://cdn.test/listings/dream.jpg")
  })

  it("does not fabricate badges or metadata", () => {
    const card = toListingCardData(makeListing())
    expect(card.featured).toBeUndefined()
    expect(card.urgent).toBeUndefined()
    expect(card.verified).toBeUndefined()
    expect(card.negotiable).toBeUndefined()
    expect(card.metadata).toBeUndefined()
  })

  it("handles null price and null media safely", () => {
    const card = toListingCardData(makeListing({ price: null, currency: null, primaryImage: null }))
    expect(card.priceOnRequest).toBe(true)
    expect(card.primaryImage).toBeUndefined()
  })
})
