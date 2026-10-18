import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { shouldHideAppHeaderOnMobile, shouldShowAppHeader } from "@/lib/constants/route-policy"
import { makeDetail } from "./detail-fixtures"

vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => (k ? `https://cdn.test/${k}` : null),
}))
const push = vi.fn()
const back = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, back }),
  usePathname: () => "/listing/x",
}))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: true, isLoading: false, user: { email: "a@b.c" } }),
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => action(),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const revealListingContacts = vi.fn()
const startConversation = vi.fn()
vi.mock("../api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("../api/listing-detail.api")>()),
  revealListingContacts: (...a: unknown[]) => revealListingContacts(...a),
  startConversation: (...a: unknown[]) => startConversation(...a),
}))

import { ListingMobileGalleryControls } from "../components/detail/listing-mobile-gallery-controls"
import { ListingMobileActionBar } from "../components/detail/listing-mobile-action-bar"
import { ListingSellerCard } from "../components/detail/listing-seller-card"

const setHistoryLength = (length: number) =>
  Object.defineProperty(window.history, "length", { value: length, configurable: true })

beforeEach(() => {
  push.mockReset()
  back.mockReset()
  revealListingContacts.mockReset()
  startConversation.mockReset()
  setHistoryLength(2)
})

describe("route policy", () => {
  it("hides the navbar on mobile for listing detail only, and never changes where the navbar exists", () => {
    expect(shouldHideAppHeaderOnMobile("/listing/abc")).toBe(true)
    for (const path of ["/", "/search", "/categories", "/category/vehicles", "/seller/abc"]) {
      expect(shouldHideAppHeaderOnMobile(path)).toBe(false)
    }
    // Desktop/tablet still render the navbar on listing detail.
    expect(shouldShowAppHeader("/listing/abc")).toBe(true)
  })
})

describe("<ListingMobileGalleryControls />", () => {
  const listing = { id: "l1", title: "Prius", isFavorited: false, isOwner: false }

  it("goes back in history when there is some", () => {
    renderWithProviders(<ListingMobileGalleryControls listing={listing} fallbackHref="/category/cars" />)
    fireEvent.click(screen.getByRole("button", { name: "Back" }))
    expect(back).toHaveBeenCalledTimes(1)
    expect(push).not.toHaveBeenCalled()
  })

  it("falls back to the category page when the listing was opened directly", () => {
    setHistoryLength(1)
    renderWithProviders(<ListingMobileGalleryControls listing={listing} fallbackHref="/category/cars" />)
    fireEvent.click(screen.getByRole("button", { name: "Back" }))
    expect(push).toHaveBeenCalledWith("/category/cars")
    expect(back).not.toHaveBeenCalled()
  })

  it("offers Save and Share over the image, and no Save to the owner", () => {
    const { rerender } = renderWithProviders(
      <ListingMobileGalleryControls listing={listing} fallbackHref="/search" />
    )
    expect(screen.getByRole("button", { name: /save to favorites/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument()

    rerender(<ListingMobileGalleryControls listing={{ ...listing, isOwner: true }} fallbackHref="/search" />)
    expect(screen.queryByRole("button", { name: /save to favorites/i })).toBeNull()
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument()
  })

  it("is mobile-only", () => {
    const { container } = renderWithProviders(
      <ListingMobileGalleryControls listing={listing} fallbackHref="/search" />
    )
    expect((container.firstElementChild as HTMLElement).className).toContain("md:hidden")
  })
})

describe("<ListingMobileActionBar /> (exactly two actions)", () => {
  const listing = { id: "l1", title: "Prius", price: "17500.00", currency: "USD" as const, isOwner: false }
  const names = () => screen.getAllByRole("button").map((b) => b.textContent?.trim())

  it("shows Call + Chat when the seller has public numbers, and no Make Offer", () => {
    renderWithProviders(<ListingMobileActionBar listing={listing} hasContacts />)
    expect(names()).toEqual(["Call", "Chat"])
    expect(screen.queryByRole("button", { name: /make offer/i })).toBeNull()
  })

  it("shows Chat with Seller + Make Offer when there are no numbers", () => {
    renderWithProviders(<ListingMobileActionBar listing={listing} hasContacts={false} />)
    expect(names()).toEqual(["Chat with Seller", "Make Offer"])
    expect(screen.queryByRole("button", { name: "Call" })).toBeNull()
  })

  it("hides Make Offer when the listing has no price", () => {
    renderWithProviders(
      <ListingMobileActionBar listing={{ ...listing, price: null, currency: null }} hasContacts={false} />
    )
    expect(names()).toEqual(["Chat with Seller"])
  })

  it("gives the owner only a link to manage their listings", () => {
    renderWithProviders(<ListingMobileActionBar listing={{ ...listing, isOwner: true }} hasContacts />)
    const manage = screen.getByRole("button", { name: /manage your listings/i })
    expect(manage.tagName).toBe("A")
    expect(manage).toHaveAttribute("href", "/account/listings")
    expect(screen.getAllByRole("button")).toHaveLength(1)
  })

  it("Call reveals the real number through the backend first, then becomes a tel: link", async () => {
    revealListingContacts.mockResolvedValue([{ id: "c1", type: "phone", value: "086225333", carrier: "smart" }])
    const { container } = renderWithProviders(<ListingMobileActionBar listing={listing} hasContacts />)
    expect(container.innerHTML).not.toContain("086225333")

    fireEvent.click(screen.getByRole("button", { name: "Call" }))

    await waitFor(() => expect(screen.getByRole("button", { name: "Call" }).tagName).toBe("A"))
    expect(screen.getByRole("button", { name: "Call" })).toHaveAttribute("href", "tel:086225333")
    expect(revealListingContacts).toHaveBeenCalledTimes(1)
    expect(revealListingContacts).toHaveBeenCalledWith("l1")
  })

  it("starts the real conversation from Chat", async () => {
    startConversation.mockResolvedValue({ id: "conv-1" })
    renderWithProviders(<ListingMobileActionBar listing={listing} hasContacts />)
    fireEvent.click(screen.getByRole("button", { name: "Chat" }))
    await waitFor(() => expect(startConversation).toHaveBeenCalledWith("l1"))
  })

  it("floats as a compact pill above the safe area", () => {
    const { container } = renderWithProviders(<ListingMobileActionBar listing={listing} hasContacts />)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("md:hidden")
    expect(root.className).toContain("safe-area-inset-bottom")
    expect(root.firstElementChild!.className).toContain("rounded-full")
  })
})

describe("<ListingSellerCard /> mobile Make Offer", () => {
  const seller = makeDetail().seller!
  const offer = { title: "Prius", price: 17500, currency: "USD" as const }

  it("carries Make Offer on mobile only when the bar shows Call + Chat", () => {
    const { rerender } = renderWithProviders(
      <ListingSellerCard seller={seller} listingId="l1" isOwner={false} mobileOffer={offer} />
    )
    expect(screen.getByRole("button", { name: "Make Offer" })).toBeInTheDocument()

    rerender(<ListingSellerCard seller={seller} listingId="l1" isOwner={false} mobileOffer={null} />)
    expect(screen.queryByRole("button", { name: "Make Offer" })).toBeNull()
  })

  it("never offers it to the owner", () => {
    renderWithProviders(<ListingSellerCard seller={seller} listingId="l1" isOwner mobileOffer={offer} />)
    expect(screen.queryByRole("button", { name: "Make Offer" })).toBeNull()
  })
})
