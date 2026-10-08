import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { ApiError } from "@/lib/api/client"
import { makeDetail } from "./detail-fixtures"
import type { PublicListing } from "../api/listings.api"

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
  useCurrentUser: () => ({ isAuthenticated: false, isLoading: false }),
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => action(),
}))

const getListing = vi.fn()
const getSimilarListings = vi.fn()
vi.mock("../api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("../api/listing-detail.api")>()),
  getListing: (...a: unknown[]) => getListing(...a),
  getSimilarListings: (...a: unknown[]) => getSimilarListings(...a),
}))

import { ListingDetailContent } from "../components/detail/listing-detail-content"

const similar = (id: string, title: string): PublicListing =>
  ({
    id,
    title,
    description: null,
    price: "900.00",
    currency: "USD",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "c", nameEn: "Cars", nameKm: null, slug: "cars" },
    location: { province: { id: 1, nameEn: "Phnom Penh", nameKm: null }, district: null, commune: null },
    seller: null,
    primaryImage: null,
  }) as PublicListing

describe("<ListingDetailContent />", () => {
  beforeEach(() => {
    getListing.mockReset()
    getSimilarListings.mockReset().mockResolvedValue([])
  })

  it("renders the real backend listing, with no demo fallback content", async () => {
    getListing.mockResolvedValue(makeDetail())
    renderWithProviders(<ListingDetailContent id="52bb0b3f" />)

    expect((await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })).length).toBeGreaterThan(0)
    expect(getListing).toHaveBeenCalledWith("52bb0b3f")
    expect(screen.getAllByText("$17,500").length).toBeGreaterThan(0)
    expect(screen.queryByText(/\+855 12 889 977/)).toBeNull()
    expect(screen.queryByText(/Show Phone/i)).toBeNull()
    expect(document.querySelector('img[src*="unsplash"]')).toBeNull()
  })

  it("shows the unavailable state for a 404 (non-public listing) without demo data", async () => {
    getListing.mockRejectedValue(new ApiError(404, { code: "NOT_FOUND", message: "Listing not found" }))
    renderWithProviders(<ListingDetailContent id="missing" />)

    expect(await screen.findByText("This listing isn't available")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull()
    expect(getSimilarListings).not.toHaveBeenCalled()
  })

  it("shows a retry state for other errors", async () => {
    getListing.mockRejectedValueOnce(new ApiError(500, { code: "SERVER", message: "boom" }))
    getListing.mockResolvedValue(makeDetail())
    renderWithProviders(<ListingDetailContent id="x" />)

    fireEvent.click(await screen.findByRole("button", { name: "Try again" }))
    expect((await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })).length).toBeGreaterThan(0)
  })

  it("shows real related listings and hides the section when the backend has none", async () => {
    getListing.mockResolvedValue(makeDetail())
    getSimilarListings.mockResolvedValue([similar("s1", "Backend related Prius")])
    const { unmount } = renderWithProviders(<ListingDetailContent id="x" />)

    expect(await screen.findByRole("heading", { name: "Backend related Prius" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Related listings" })).toBeInTheDocument()
    unmount()

    getSimilarListings.mockResolvedValue([])
    renderWithProviders(<ListingDetailContent id="x" />)
    await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })
    expect(screen.queryByRole("heading", { name: "Related listings" })).toBeNull()
  })

  it("tolerates missing optional data (no description, no seller, no media, no specs)", async () => {
    getListing.mockResolvedValue(
      makeDetail({ description: null, seller: null, media: [], specs: [], price: null, currency: null })
    )
    renderWithProviders(<ListingDetailContent id="x" />)

    expect((await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Contact for price").length).toBeGreaterThan(0)
    expect(screen.getAllByText("No photos available").length).toBeGreaterThan(0)
    expect(screen.queryByText("Description")).toBeNull()
    expect(screen.queryByText("View Store Profile")).toBeNull()
  })

  it("renders the owner's view without contact actions", async () => {
    getListing.mockResolvedValue(makeDetail({ isOwner: true }))
    renderWithProviders(<ListingDetailContent id="x" />)

    await screen.findAllByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })
    expect(screen.queryByRole("button", { name: /chat with seller/i })).toBeNull()
    expect(screen.getAllByText("Manage your listings").length).toBeGreaterThan(0)
  })
})
