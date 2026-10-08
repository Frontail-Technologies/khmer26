import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { makeBanner, makeHome, makeListing } from "./fixtures"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: false, isLoading: false }),
}))

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({ getMediaUrl: (k: string | null | undefined) => getMediaUrl(k) }))

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const getHome = vi.fn()
vi.mock("../api/home.api", async (orig) => ({
  ...(await orig<typeof import("../api/home.api")>()),
  getHome: () => getHome(),
}))

import { HomeContent } from "../components/home-content"

describe("<HomeContent />", () => {
  beforeEach(() => {
    getHome.mockReset()
    getMediaUrl.mockClear()
  })

  it("renders real listings through the existing cards", async () => {
    getHome.mockResolvedValue(makeHome({ newListings: [makeListing()] }))
    renderWithProviders(<HomeContent />)

    expect(await screen.findByRole("heading", { name: "Backend Honda Dream" })).toBeInTheDocument()
    expect(screen.getByText("$1,250")).toBeInTheDocument()
    expect(screen.getByText("Chamkar Mon, Phnom Penh")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Backend Honda Dream" })).toHaveAttribute(
      "src",
      "https://cdn.test/listings/dream.jpg"
    )
    expect(screen.getByLabelText("Backend Honda Dream")).toHaveAttribute(
      "href",
      "/listing/11111111-1111-1111-1111-111111111111"
    )
  })

  it("shows the sell promo as the first card of Latest Listings, linking to Post Ad", async () => {
    getHome.mockResolvedValue(makeHome({ newListings: [makeListing()] }))
    renderWithProviders(<HomeContent />)

    const promo = await screen.findByText("Want to see your ads here?")
    expect(promo).toBeInTheDocument()
    expect(screen.getByText("Sell").closest("a")).toHaveAttribute("href", "/post-ad")
    const grid = promo.closest("div.grid")!
    expect(grid.firstElementChild).toContainElement(promo)
  })

  it("renders popular categories from the backend and links to category pages", async () => {
    getHome.mockResolvedValue(
      makeHome({
        popularCategories: [
          { id: "c2", name: "Phones", slug: "phones", parentId: null, imageR2Key: null, sortOrder: 2 },
          { id: "c1", name: "Cars", slug: "cars", parentId: null, imageR2Key: "categories/cars.png", sortOrder: 1 },
        ],
      })
    )
    renderWithProviders(<HomeContent />)

    const cars = await screen.findByRole("link", { name: /cars/i })
    expect(cars).toHaveAttribute("href", "/category/cars")
    expect(getMediaUrl).toHaveBeenCalledWith("categories/cars.png")
    expect(screen.getByRole("img", { name: "Cars" })).toHaveAttribute("src", "https://cdn.test/categories/cars.png")
    expect(screen.queryByRole("img", { name: "Phones" })).toBeNull()
    const names = screen.getAllByRole("link").map((l) => l.textContent)
    expect(names.findIndex((t) => t?.includes("Cars"))).toBeLessThan(
      names.findIndex((t) => t?.includes("Phones"))
    )
  })

  it("shows no banner when the backend has none and does not invent promotional content", async () => {
    getHome.mockResolvedValue(makeHome({ newListings: [makeListing()] }))
    const { container } = renderWithProviders(<HomeContent />)
    await screen.findByRole("heading", { name: "Backend Honda Dream" })

    expect(container.querySelector("img[alt='Real banner']")).toBeNull()
    expect(screen.queryByText(/marketplace event/i)).toBeNull()
  })

  it("renders the active backend banner via the media resolver", async () => {
    getHome.mockResolvedValue(makeHome({ banners: [makeBanner()] }))
    renderWithProviders(<HomeContent />)

    const img = await screen.findByRole("img", { name: "Real banner" })
    expect(img).toHaveAttribute("src", "https://cdn.test/banners/real.jpg")
    expect(getMediaUrl).toHaveBeenCalledWith("banners/real.jpg")
    expect(screen.getByRole("link", { name: "Real banner" })).toHaveAttribute("href", "/category/vehicles")
  })

  it("never falls back to demo listings, categories or locations", async () => {
    getHome.mockResolvedValue(makeHome())
    renderWithProviders(<HomeContent />)

    await screen.findByText(/have something to sell/i)
    expect(screen.queryByText(/Toyota Prius/i)).toBeNull()
    expect(screen.queryByText(/Browse by City/i)).toBeNull()
    expect(screen.queryByText(/Popular Categories/i)).toBeNull()
    expect(screen.queryByText(/Featured Listings/i)).toBeNull()
  })

  it("shows a retry state on error and recovers", async () => {
    getHome.mockRejectedValueOnce(new Error("boom"))
    getHome.mockResolvedValue(makeHome({ newListings: [makeListing()] }))
    renderWithProviders(<HomeContent />)

    const retry = await screen.findByRole("button", { name: /try again/i })
    fireEvent.click(retry)
    await waitFor(() => expect(screen.getByRole("heading", { name: "Backend Honda Dream" })).toBeInTheDocument())
  })
})
