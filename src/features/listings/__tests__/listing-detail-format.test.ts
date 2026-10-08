import { describe, expect, it, vi } from "vitest"
import { makeDetail } from "./detail-fixtures"

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => getMediaUrl(k),
}))

import {
  formatListingPrice,
  formatLocation,
  formatMemberSince,
  formatSpecValue,
  toGalleryImages,
} from "../lib/listing-detail-format"

describe("listing detail formatting", () => {
  it("builds gallery images from real media in backend order through getMediaUrl", () => {
    const images = toGalleryImages(makeDetail().media, "Prius")
    expect(images.map((i) => i.url)).toEqual([
      "https://cdn.test/listings/a.jpg",
      "https://cdn.test/listings/b.jpg",
    ])
    expect(getMediaUrl).toHaveBeenCalledWith("listings/a.jpg")
    expect(images[0]!.alt).toBe("Prius photo 1")
  })

  it("returns no images (never a fallback) when there is no media or no resolvable URL", () => {
    expect(toGalleryImages([], "x")).toEqual([])
    getMediaUrl.mockReturnValueOnce(null)
    expect(
      toGalleryImages([{ id: "m", r2Key: "k", mimeType: "image/jpeg", displayOrder: 0 }], "x")
    ).toEqual([])
  })

  it("formats the location from whichever levels exist, most specific first", () => {
    const base = makeDetail().location
    expect(formatLocation({ ...base, commune: { id: 1, nameEn: "Tonle Bassac", nameKm: null } })).toBe(
      "Tonle Bassac, Chamkarmon, Phnom Penh"
    )
    expect(formatLocation(base)).toBe("Chamkarmon, Phnom Penh")
    expect(formatLocation({ ...base, district: null })).toBe("Phnom Penh")
  })

  it("formats prices and treats a missing price honestly", () => {
    expect(formatListingPrice({ price: "17500.00", currency: "USD" })).toBe("$17,500")
    expect(formatListingPrice({ price: "11000000", currency: "KHR" })).toBe("11,000,000 KHR")
    expect(formatListingPrice({ price: null, currency: null })).toBe("Contact for price")
  })

  it("formats each spec type from backend values", () => {
    const [select, number, bool] = makeDetail().specs
    expect(formatSpecValue(select!)).toBe("Automatic")
    expect(formatSpecValue(number!)).toBe("2018")
    expect(formatSpecValue({ ...number!, value: 4200 })).toBe("4200")
    expect(formatSpecValue({ ...number!, value: 125000 })).toBe("125,000")
    expect(formatSpecValue({ ...number!, value: 12.5 })).toBe("12.5")
    expect(formatSpecValue(bool!)).toBe("Yes")
    expect(formatSpecValue({ ...bool!, value: false })).toBe("No")
    expect(formatSpecValue({ ...select!, fieldType: "text", value: "Toyota", valueLabelEn: undefined })).toBe("Toyota")
  })

  it("formats the member-since date and tolerates bad input", () => {
    expect(formatMemberSince("2026-03-05T00:00:00.000Z")).toBe("Mar 2026")
    expect(formatMemberSince("not a date")).toBe("")
  })
})
