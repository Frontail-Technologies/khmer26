import { describe, expect, it, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { makeDetail } from "./detail-fixtures"
import type { PublicListing } from "../api/listings.api"
import { isLoanEligible } from "../lib/loan-eligibility"

vi.mock("maplibre-gl", async () => (await import("./maplibre-mock")).maplibreMock)
vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}))
vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => (k ? `https://cdn.test/${k}` : null),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/listing/x",
}))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: true, isLoading: false }),
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => action(),
}))

const getListing = vi.fn()
const getSimilarListings = vi.fn()
const getSellerListings = vi.fn()
vi.mock("../api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("../api/listing-detail.api")>()),
  getListing: (...a: unknown[]) => getListing(...a),
  getSimilarListings: (...a: unknown[]) => getSimilarListings(...a),
  getSellerListings: (...a: unknown[]) => getSellerListings(...a),
}))

import { ListingDetailContent } from "../components/detail/listing-detail-content"

const card = (id: string, title: string): PublicListing =>
  ({
    id,
    title,
    description: null,
    price: "100.00",
    currency: "USD",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "c", nameEn: "Cars", nameKm: null, slug: "cars" },
    location: { province: { id: 1, nameEn: "Phnom Penh", nameKm: null }, district: null, commune: null },
    seller: null,
    primaryImage: null,
  }) as PublicListing

const crumb = (slug: string) => ({ id: slug, nameEn: slug, nameKm: null, slug })

describe("loan calculator eligibility", () => {
  const withCategory = (slugs: string[], price: string | null) => ({
    price,
    category: { ...crumb("leaf"), breadcrumb: slugs.map(crumb) },
  })

  it("requires a numeric price and an eligible category ancestor", () => {
    expect(isLoanEligible(withCategory(["vehicles", "cars"], "18000"))).toBe(true)
    expect(isLoanEligible(withCategory(["property", "land"], "95000"))).toBe(true)
    expect(isLoanEligible(withCategory(["electronics", "mobile-phones"], "950"))).toBe(false)
    expect(isLoanEligible(withCategory(["vehicles"], null))).toBe(false)
    expect(isLoanEligible(withCategory(["vehicles"], "0"))).toBe(false)
  })

  it("decides by category ancestry, never by title", () => {
    const listing = {
      ...withCategory(["jobs"], "5000"),
      title: "Toyota car for sale, house and land",
    }
    expect(isLoanEligible(listing)).toBe(false)
  })
})

describe("<ListingDetailContent /> layout rules", () => {
  beforeEach(() => {
    getListing.mockReset()
    getSimilarListings.mockReset().mockResolvedValue([])
    getSellerListings.mockReset().mockResolvedValue([])
  })

  it("shows the loan calculator only for eligible categories", async () => {
    getListing.mockResolvedValue(makeDetail())
    const { unmount } = renderWithProviders(<ListingDetailContent id="x" />)
    expect((await screen.findAllByText("Loan Calculator")).length).toBeGreaterThan(0)
    unmount()

    getListing.mockResolvedValue(
      makeDetail({
        category: { ...crumb("jobs"), nameEn: "Jobs", breadcrumb: [crumb("jobs")] },
      })
    )
    renderWithProviders(<ListingDetailContent id="x" />)
    await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })
    expect(screen.queryByText("Loan Calculator")).toBeNull()
  })

  it("has no chat button inside the seller card", async () => {
    getListing.mockResolvedValue(makeDetail())
    renderWithProviders(<ListingDetailContent id="x" />)

    const sellerLink = (await screen.findAllByText("View Store Profile"))[0]!
    const sellerCard = sellerLink.closest('[data-slot="card"]') as HTMLElement
    expect(sellerCard.textContent).not.toMatch(/chat/i)
  })

  it("shows 'More from this seller' without repeating related listings or the current one", async () => {
    getListing.mockResolvedValue(makeDetail())
    getSimilarListings.mockResolvedValue([card("r1", "Related one"), card("r2", "Related two")])
    getSellerListings.mockResolvedValue([
      card("52bb0b3f-4272-43a6-baa4-76bacc1d13c0", "The current listing"),
      card("r1", "Related one"),
      card("s1", "Seller extra one"),
      card("s2", "Seller extra two"),
    ])
    renderWithProviders(<ListingDetailContent id="x" />)

    expect(await screen.findByRole("heading", { name: "More from Angkor Auto & Bikes" })).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "Seller extra one" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Seller extra two" })).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { name: "Related one" })).toHaveLength(1)
    expect(screen.queryByRole("heading", { name: "The current listing" })).toBeNull()
  })

  it("omits the seller section when the seller has nothing else", async () => {
    getListing.mockResolvedValue(makeDetail())
    getSimilarListings.mockResolvedValue([card("r1", "Related one")])
    getSellerListings.mockResolvedValue([card("52bb0b3f-4272-43a6-baa4-76bacc1d13c0", "The current listing")])
    renderWithProviders(<ListingDetailContent id="x" />)

    await screen.findByRole("heading", { name: "Related listings" })
    expect(screen.queryByText(/More from/)).toBeNull()
  })

  it("renders the real map when the backend resolved coordinates, and never a placeholder", async () => {
    getListing.mockResolvedValue(makeDetail())
    const { container } = renderWithProviders(<ListingDetailContent id="x" />)

    expect(await screen.findByRole("region", { name: /Map of the approximate area/ })).toBeInTheDocument()
    expect(container.querySelector('[class*="radial-gradient"]')).toBeNull()
    expect(screen.queryByText(/view on map/i)).toBeNull()
    expect(screen.getByText(/shared by the seller after contact/i)).toBeInTheDocument()
  })

  it("renders the text-only location when the backend has no coordinates", async () => {
    const base = makeDetail()
    getListing.mockResolvedValue(makeDetail({ location: { ...base.location, map: null } }))
    renderWithProviders(<ListingDetailContent id="x" />)

    await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })
    expect(screen.queryByRole("region", { name: /Map/ })).toBeNull()
    expect(screen.getByText(/shared by the seller after contact/i)).toBeInTheDocument()
  })
})
