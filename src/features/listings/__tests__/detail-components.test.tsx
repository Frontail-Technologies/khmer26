import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { makeDetail } from "./detail-fixtures"

vi.mock("maplibre-gl", async () => (await import("./maplibre-mock")).maplibreMock)
vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}))

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => getMediaUrl(k),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/listing/x",
}))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: true, isLoading: false, user: { email: "a@b.c" } }),
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => action(),
}))

import { ListingBreadcrumbs } from "../components/detail/listing-breadcrumbs"
import { ListingSpecifications } from "../components/detail/listing-specifications"
import { ListingGallery } from "../components/detail/listing-gallery"
import { ListingPrimaryPanel } from "../components/detail/listing-primary-panel"
import { ListingSellerCard } from "../components/detail/listing-seller-card"
import { ListingDescription } from "../components/detail/listing-description"
import { ListingLocation } from "../components/detail/listing-location"
import { ListingSafetyCard } from "../components/detail/listing-safety-card"
import { toGalleryImages } from "../lib/listing-detail-format"

describe("<ListingBreadcrumbs /> (arbitrary depth)", () => {
  it("renders the real ancestry with a link per level and the current title last", () => {
    const detail = makeDetail()
    renderWithProviders(
      <ListingBreadcrumbs categoryPath={detail.category.breadcrumb} title={detail.title} />
    )

    const hrefs = screen
      .getAllByRole("link")
      .filter((a) => a.hasAttribute("href"))
      .map((a) => a.getAttribute("href"))
    expect(hrefs).toEqual([
      "/",
      "/category/vehicles",
      "/category/vehicles/cars",
      "/category/vehicles/cars/toyota",
      "/category/vehicles/cars/toyota/hybrid",
    ])
    expect(screen.getByText(detail.title)).toBeInTheDocument()
  })

  it("works with a single-level category", () => {
    renderWithProviders(
      <ListingBreadcrumbs
        categoryPath={[{ id: "1", nameEn: "Jobs", nameKm: null, slug: "jobs" }]}
        title="Driver"
      />
    )
    expect(screen.getAllByRole("link").filter((a) => a.hasAttribute("href"))).toHaveLength(2)
  })
})

describe("<ListingSpecifications />", () => {
  it("renders only the backend specs (select label, number, boolean) plus the category", () => {
    renderWithProviders(<ListingSpecifications listing={makeDetail()} />)

    expect(screen.getByText("Transmission")).toBeInTheDocument()
    expect(screen.getByText("Automatic")).toBeInTheDocument()
    expect(screen.getByText("Year")).toBeInTheDocument()
    expect(screen.getByText("2018")).toBeInTheDocument()
    expect(screen.getAllByText("Hybrid")).toHaveLength(2)
    expect(screen.getByText("Yes")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
  })

  it("shows nothing category-specific when the listing has no specs", () => {
    renderWithProviders(<ListingSpecifications listing={makeDetail({ specs: [] })} />)
    expect(screen.queryByText(/mileage|fuel|brand|bedrooms|storage/i)).toBeNull()
    expect(screen.getAllByText(/./).length).toBeGreaterThan(0)
  })
})

describe("<ListingGallery />", () => {
  it("shows the real photos, a counter, and thumbnails", () => {
    const images = toGalleryImages(makeDetail().media, "Prius")
    renderWithProviders(<ListingGallery images={images} title="Prius" />)

    expect(screen.getByText("1 / 2")).toBeInTheDocument()
    expect(screen.getAllByRole("img", { name: /Prius photo 1/ }).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: "Next photo" }))
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
  })

  it("shows a neutral placeholder, not a stock photo, when there are no photos", () => {
    const { container } = renderWithProviders(<ListingGallery images={[]} title="No photos" />)

    expect(screen.getByText("No photos available")).toBeInTheDocument()
    expect(container.querySelector("img")).toBeNull()
    expect(screen.queryByRole("button", { name: "Next photo" })).toBeNull()
    expect(screen.queryByText(/0 \/ 0/)).toBeNull()
  })
})

describe("<ListingDescription />", () => {
  it("renders nothing when the backend has no description", () => {
    const { container } = renderWithProviders(<ListingDescription description={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the description text under a Description heading", () => {
    renderWithProviders(<ListingDescription description="First. Second." />)
    expect(screen.getByRole("heading", { name: "Description" })).toBeInTheDocument()
    expect(screen.getByText(/First\./)).toBeInTheDocument()
    expect(screen.getByText(/Second\./)).toBeInTheDocument()
  })
})

describe("<ListingPrimaryPanel /> basic info", () => {
  beforeEach(() => getMediaUrl.mockClear())

  it("shows real price, title, location, age and views, and no invented badges", () => {
    renderWithProviders(<ListingPrimaryPanel listing={makeDetail()} />)

    expect(screen.getByText("$17,500")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Toyota Prius 2018 - Hybrid" })).toBeInTheDocument()
    expect(screen.getByText("Chamkarmon, Phnom Penh")).toBeInTheDocument()
    expect(screen.getByText("42 views")).toBeInTheDocument()
    expect(screen.queryByText(/negotiable|urgent|featured|verified/i)).toBeNull()
  })

  it("handles a listing with no price", () => {
    renderWithProviders(<ListingPrimaryPanel listing={makeDetail({ price: null, currency: null })} />)
    expect(screen.getByText("Contact for price")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /make offer/i })).toBeNull()
  })

  it("offers chat, offer, report and favorite to a visitor", () => {
    renderWithProviders(<ListingPrimaryPanel listing={makeDetail()} />)
    expect(screen.getByRole("button", { name: /chat with seller/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /make offer/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Report" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
  })

  it("owner view: no self-contact, offer, report or favorite; links to manage listings", () => {
    renderWithProviders(
      <ListingPrimaryPanel listing={makeDetail({ isOwner: true, moderationStatus: "pending_review" })} />
    )
    expect(screen.queryByRole("button", { name: /chat with seller/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /make offer/i })).toBeNull()
    expect(screen.queryByRole("button", { name: "Report" })).toBeNull()
    expect(screen.queryByRole("button", { name: /favorites/i })).toBeNull()
    expect(screen.getByText("Manage your listings").closest("a")).toHaveAttribute("href", "/account/listings")
    expect(screen.getByText(/pending review/i)).toBeInTheDocument()
  })
})

describe("<ListingSellerCard />", () => {
  it("shows only real seller fields, links to the seller route, and has no chat button", () => {
    renderWithProviders(<ListingSellerCard seller={makeDetail().seller!} />)

    expect(screen.getByText("Angkor Auto & Bikes")).toBeInTheDocument()
    expect(screen.getByText("Dealer")).toBeInTheDocument()
    expect(screen.getByText("Member since Mar 2026")).toBeInTheDocument()
    expect(getMediaUrl).toHaveBeenCalledWith("avatars/s1.png")
    expect(screen.queryByRole("button", { name: /chat/i })).toBeNull()
    expect(screen.queryByText(/replies|active listings|verified|review|call/i)).toBeNull()
    expect(screen.getByText("View Store Profile").closest("a")).toHaveAttribute("href", "/seller/s1")
  })

  it("shows the verified badge and rating only when the backend says so", () => {
    const base = makeDetail().seller!
    const { rerender } = renderWithProviders(
      <ListingSellerCard seller={{ ...base, isVerified: true, rating: { average: 4.5, count: 2 } }} />
    )
    expect(screen.getByLabelText("Verified seller")).toBeInTheDocument()
    expect(screen.getByText("4.5")).toBeInTheDocument()
    expect(screen.getByText("(2 reviews)")).toBeInTheDocument()

    rerender(<ListingSellerCard seller={{ ...base, rating: { average: 5, count: 1 } }} />)
    expect(screen.getByText("(1 review)")).toBeInTheDocument()
    expect(screen.queryByLabelText("Verified seller")).toBeNull()
  })
})

const RAW_DESCRIPTION = ["Line one", "Line <b>two</b>", "", "Call 012 345 678"].join("\n")

describe("listing detail polish", () => {
  it("groups Save, Share and Report in the main action card (once each)", () => {
    renderWithProviders(<ListingPrimaryPanel listing={makeDetail()} />)
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Report" })).toBeInTheDocument()
  })

  it("does not repeat favorite or share on the gallery image", () => {
    renderWithProviders(<ListingGallery images={toGalleryImages(makeDetail().media, "Prius")} title="Prius" />)
    expect(screen.queryByRole("button", { name: /favorites/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /share/i })).toBeNull()
    expect(screen.getByRole("button", { name: "View fullscreen photo" })).toBeInTheDocument()
  })

  it("moves through photos with the arrow keys when the gallery is focused", () => {
    renderWithProviders(<ListingGallery images={toGalleryImages(makeDetail().media, "Prius")} title="Prius" />)
    const gallery = screen.getByRole("group", { name: /photos/i })
    fireEvent.keyDown(gallery, { key: "ArrowRight" })
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
    fireEvent.keyDown(gallery, { key: "ArrowLeft" })
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("renders specs as a compact grid, or a single slim line when only the category is known", () => {
    const { container, rerender } = renderWithProviders(<ListingSpecifications listing={makeDetail()} />)
    expect(container.querySelector("dl")).not.toBeNull()
    expect(screen.getByText("Listing Details")).toBeInTheDocument()

    rerender(<ListingSpecifications listing={makeDetail({ specs: [] })} />)
    expect(container.querySelector("dl")).toBeNull()
    expect(screen.queryByText("Listing Details")).toBeNull()
    expect(screen.getByText("Category:")).toBeInTheDocument()
  })

  it("preserves description line breaks as plain text (nothing is rendered as HTML)", () => {
    const { container } = renderWithProviders(
      <ListingDescription description={RAW_DESCRIPTION} />
    )
    const text = container.querySelector("p")!
    expect(text.className).toContain("whitespace-pre-line")
    expect(text.textContent).toBe(RAW_DESCRIPTION)
    expect(container.querySelector("b")).toBeNull()
  })

  it("shows the location as text with no fake map and no map link", () => {
    const { container } = renderWithProviders(
      <ListingLocation location={{ ...makeDetail().location, map: null }} />
    )
    expect(screen.getByText("Chamkarmon, Phnom Penh")).toBeInTheDocument()
    expect(screen.getByText(/Exact location is shared by the seller after contact/)).toBeInTheDocument()
    expect(screen.queryByText(/view on map/i)).toBeNull()
    expect(container.querySelector("a")).toBeNull()
    expect(container.querySelector('[class*="radial-gradient"]')).toBeNull()
  })

  it("keeps the safety card short and links to a page that exists", () => {
    renderWithProviders(<ListingSafetyCard />)
    expect(screen.getAllByRole("listitem")).toHaveLength(4)
    expect(screen.getByText("View Safety Tips").closest("a")).toHaveAttribute("href", "/posting-rules")
  })

  it("pluralizes views correctly", () => {
    const { rerender } = renderWithProviders(<ListingPrimaryPanel listing={makeDetail({ views: 1 })} />)
    expect(screen.getByText("1 view")).toBeInTheDocument()
    rerender(<ListingPrimaryPanel listing={makeDetail({ views: 0 })} />)
    expect(screen.getByText("0 views")).toBeInTheDocument()
  })
})
