import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { ApiError } from "@/lib/api/client"
import { makeListing, makeReview, makeSeller, pagination } from "./seller-fixtures"

vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => (k ? `https://cdn.test/${k}` : null),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
const push = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, back: vi.fn() }),
  usePathname: () => "/seller/x",
}))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ user: null, isAuthenticated: true, isLoading: false }),
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => action(),
}))

const getSeller = vi.fn()
const getSellerListingsPage = vi.fn()
const getSellerReviewsPage = vi.fn()
const createReview = vi.fn()
const getSellerReportReasons = vi.fn()
const reportSeller = vi.fn()
vi.mock("../api/sellers.api", async (orig) => ({
  ...(await orig<typeof import("../api/sellers.api")>()),
  getSeller: (...a: unknown[]) => getSeller(...a),
  getSellerListingsPage: (...a: unknown[]) => getSellerListingsPage(...a),
  getSellerReviewsPage: (...a: unknown[]) => getSellerReviewsPage(...a),
  createReview: (...a: unknown[]) => createReview(...a),
  getSellerReportReasons: (...a: unknown[]) => getSellerReportReasons(...a),
  reportSeller: (...a: unknown[]) => reportSeller(...a),
}))

const startConversation = vi.fn()
vi.mock("@/features/listings/api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("@/features/listings/api/listing-detail.api")>()),
  startConversation: (...a: unknown[]) => startConversation(...a),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { SellerProfileContent } from "../components/seller-profile-content"
import { SellerReportDialog } from "../components/seller-report-dialog"
import { marketplaceKeys } from "@/lib/query/keys"

const SELLER = makeSeller()

function setup({
  seller = SELLER,
  listings = [makeListing("l1"), makeListing("l2")],
  listingTotal = listings.length,
  reviews = [makeReview("r1"), makeReview("r2", { rating: 3, comment: "Okay" })],
}: {
  seller?: ReturnType<typeof makeSeller>
  listings?: ReturnType<typeof makeListing>[]
  listingTotal?: number
  reviews?: ReturnType<typeof makeReview>[]
} = {}) {
  getSeller.mockResolvedValue(seller)
  getSellerListingsPage.mockResolvedValue({ items: listings, pagination: pagination(1, listingTotal) })
  getSellerReviewsPage.mockResolvedValue({ items: reviews, pagination: pagination(1, reviews.length, 10) })
  return renderWithProviders(<SellerProfileContent id={seller.id} />)
}

/** The shop name is the page <h1> in the profile header (the mobile header repeats it). */
async function findShopHeading(name: string | RegExp) {
  const headings = await screen.findAllByRole("heading", { level: 1, name })
  return headings[headings.length - 1]!
}

async function openReviews() {
  const tab = await screen.findByRole("tab", { name: /Reviews/ })
  fireEvent.mouseDown(tab)
  fireEvent.click(tab)
}

beforeEach(() => {
  for (const fn of [
    getSeller,
    getSellerListingsPage,
    getSellerReviewsPage,
    createReview,
    getSellerReportReasons,
    reportSeller,
    startConversation,
    push,
  ]) {
    fn.mockReset()
  }
})

describe("seller header", () => {
  it("shows real name, type, verified badge, member since, listing count, rating and bio", async () => {
    setup()
    expect(await findShopHeading("Angkor Motors")).toBeInTheDocument()
    expect(screen.getByLabelText("Verified seller")).toBeInTheDocument()
    expect(screen.getByText("Dealer")).toBeInTheDocument()
    expect(screen.getByText(/Member since Mar 2024/)).toBeInTheDocument()
    expect(screen.getByText("2 active listings")).toBeInTheDocument()
    expect(screen.getByText("4.5")).toBeInTheDocument()
    expect(screen.getByText("(4 reviews)")).toBeInTheDocument()
    expect(screen.getByText("Family-run dealership in Phnom Penh.")).toBeInTheDocument()
  })

  it("never invents followers, response time, phone, sales or views", async () => {
    const { container } = setup()
    await findShopHeading("Angkor Motors")
    const text = container.textContent ?? ""
    for (const fake of [/follower/i, /response/i, /\bphone\b/i, /\bsold\b/i, /\bviews\b/i, /Follow\b/]) {
      expect(text).not.toMatch(fake)
    }
    expect(screen.queryByRole("button", { name: /follow/i })).toBeNull()
  })

  it("hides the verified badge, rating and bio when the backend does not return them, and falls back to initials", async () => {
    setup({ seller: makeSeller({ isVerified: false, rating: null, bio: null, avatarR2Key: null }) })
    await findShopHeading("Angkor Motors")
    expect(screen.queryByLabelText("Verified seller")).toBeNull()
    expect(screen.queryByText(/\(\d+ reviews?\)/)).toBeNull()
    expect(screen.queryByText(/Family-run/)).toBeNull()
    expect(screen.queryByAltText("Angkor Motors")).toBeNull()
    expect(screen.getByText("AM")).toBeInTheDocument()
  })

  it("renders a very long shop name without truncating it away", async () => {
    const longName = "The Extraordinarily Long Named Premium Automotive Trading Company of Cambodia Limited"
    setup({ seller: makeSeller({ shopName: longName }) })
    expect(await findShopHeading(longName)).toBeInTheDocument()
  })
})

describe("seller states", () => {
  it("shows a not-available state for a hidden/missing seller and never a demo fallback", async () => {
    getSeller.mockRejectedValue(new ApiError(404, { code: "NOT_FOUND", message: "Seller profile not found" }))
    renderWithProviders(<SellerProfileContent id="gone" />)
    expect(await screen.findByText("This seller isn't available")).toBeInTheDocument()
    expect(screen.queryAllByRole("heading", { level: 1, name: /Angkor|Sokha|Khmer/ })).toHaveLength(0)
    expect(getSellerListingsPage).not.toHaveBeenCalled()
  })

  it("offers a retry on a transient error", async () => {
    getSeller.mockRejectedValue(new ApiError(500, { code: "INTERNAL", message: "boom" }))
    renderWithProviders(<SellerProfileContent id="x" />)
    expect(await screen.findByText("We couldn't load this seller")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
  })
})

describe("seller listings", () => {
  it("renders the real listings and the real total", async () => {
    setup({ listings: [makeListing("l1", "Prius"), makeListing("l2", "Camry")], listingTotal: 2 })
    expect((await screen.findAllByText("Prius")).length).toBeGreaterThan(0)
    expect(screen.getAllByText("Camry").length).toBeGreaterThan(0)
    expect(screen.getByText("Showing 2 of 2 active listings")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /load more listings/i })).toBeNull()
  })

  it("loads the next real page", async () => {
    getSeller.mockResolvedValue(makeSeller({ listingCount: 13 }))
    getSellerReviewsPage.mockResolvedValue({ items: [], pagination: pagination(1, 0, 10) })
    getSellerListingsPage
      .mockResolvedValueOnce({
        items: Array.from({ length: 12 }, (_, i) => makeListing(`a${i}`, `First ${i}`)),
        pagination: pagination(1, 13),
      })
      .mockResolvedValueOnce({ items: [makeListing("b0", "Thirteenth")], pagination: pagination(2, 13) })
    renderWithProviders(<SellerProfileContent id={SELLER.id} />)

    expect(await screen.findByText("Showing 12 of 13 active listings")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /load more listings/i }))
    expect((await screen.findAllByText("Thirteenth")).length).toBeGreaterThan(0)
    expect(getSellerListingsPage).toHaveBeenLastCalledWith(SELLER.id, { page: 2, limit: 12 })
    expect(screen.getByText("Showing 13 of 13 active listings")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /load more listings/i })).toBeNull()
  })

  it("shows an empty state for a seller with zero listings and offers no chat", async () => {
    setup({ seller: makeSeller({ listingCount: 0 }), listings: [], listingTotal: 0 })
    expect(await screen.findByText("No active listings")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /chat with seller/i })).toBeNull()
  })
})

describe("seller reviews", () => {
  it("shows the real average, count and distribution, and the visible reviews", async () => {
    setup()
    await openReviews()
    expect(await screen.findByText("Based on 4 reviews")).toBeInTheDocument()
    expect(screen.getByText("Great seller r1")).toBeInTheDocument()
    expect(screen.getByText("Okay")).toBeInTheDocument()
    // Reviewer identity is the masked name from the backend, never an email.
    expect(screen.getAllByText("so***").length).toBeGreaterThan(0)
    expect(screen.queryByText(/@/)).toBeNull()
    const distribution = screen.getByText("5★").parentElement!
    expect(distribution).toHaveTextContent("2")
  })

  it("shows an empty state and no summary for a seller with zero reviews", async () => {
    setup({ seller: makeSeller({ rating: null }), reviews: [] })
    await openReviews()
    expect(await screen.findByText("No reviews yet")).toBeInTheDocument()
    expect(screen.queryByText(/Based on/)).toBeNull()
    expect(screen.queryByText("5★")).toBeNull()
  })

  it("renders exactly what the backend returns (hidden reviews never reach the page)", async () => {
    setup({ reviews: [makeReview("only", { comment: "Visible review" })] })
    await openReviews()
    expect(await screen.findByText("Visible review")).toBeInTheDocument()
    expect(getSellerReviewsPage).toHaveBeenCalledWith(SELLER.id, { page: 1, limit: 10 })
  })
})

describe("review submission", () => {
  async function fillAndSubmit(stars = 4, comment = "Fast and honest") {
    await openReviews()
    const form = await screen.findByRole("form", { name: "Write a review" })
    expect(form).toBeInTheDocument()
    const submit = screen.getByRole("button", { name: "Post review" })
    expect(submit).toBeDisabled()
    fireEvent.click(screen.getByRole("radio", { name: `${stars} stars` }))
    fireEvent.change(screen.getByLabelText("Review comment"), { target: { value: comment } })
    fireEvent.click(submit)
  }

  it("sends rating + comment and refreshes only the seller detail and reviews", async () => {
    createReview.mockResolvedValue(undefined)
    const { queryClient } = setup()
    const invalidate = vi.spyOn(queryClient, "invalidateQueries")
    await fillAndSubmit()

    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith({
        sellerProfileId: SELLER.id,
        rating: 4,
        comment: "Fast and honest",
      })
    )
    expect(await screen.findByText(/your review has been posted/)).toBeInTheDocument()

    const keys = invalidate.mock.calls.map((c) => JSON.stringify((c[0] as { queryKey: unknown }).queryKey))
    expect(keys).toContain(JSON.stringify(marketplaceKeys.sellers.detail(SELLER.id)))
    expect(keys).toContain(JSON.stringify([...marketplaceKeys.sellers.all, "reviews", SELLER.id]))
    expect(keys.some((k) => k.includes("listings"))).toBe(false)
  })

  it("explains a duplicate review using the backend rule", async () => {
    createReview.mockRejectedValue(
      new ApiError(409, {
        code: "CONFLICT",
        message: "You have already reviewed this seller",
        details: { code: "DUPLICATE_REVIEW" },
      })
    )
    setup()
    await fillAndSubmit()
    expect(await screen.findByRole("alert")).toHaveTextContent("You have already reviewed this seller.")
  })

  it("blocks self-review: the form is not offered on your own profile", async () => {
    setup({ seller: makeSeller({ isOwner: true }) })
    await openReviews()
    await screen.findByText(/Based on/)
    expect(screen.queryByRole("form", { name: "Write a review" })).toBeNull()
    expect(screen.queryByRole("button", { name: /chat with seller/i })).toBeNull()
  })

  it("also surfaces the backend self-review error if it ever comes back", async () => {
    createReview.mockRejectedValue(
      new ApiError(403, {
        code: "FORBIDDEN",
        message: "You cannot review your own seller profile",
        details: { code: "SELF_REVIEW_PROHIBITED" },
      })
    )
    setup()
    await fillAndSubmit()
    expect(await screen.findByRole("alert")).toHaveTextContent("You can't review your own shop.")
  })
})

describe("chat CTA", () => {
  it("starts the real conversation from the seller's first listing and never navigates to the messages page", async () => {
    startConversation.mockResolvedValue({ id: "conv-1" })
    setup()
    fireEvent.click(await screen.findByRole("button", { name: /chat with seller/i }))
    await waitFor(() => expect(startConversation).toHaveBeenCalledWith("l1"))
    expect(push).not.toHaveBeenCalledWith(expect.stringContaining("/messages"))
  })
})

describe("report seller", () => {
  const renderDialog = () =>
    renderWithProviders(
      <SellerReportDialog open onOpenChange={() => {}} sellerId={SELLER.id} sellerName="Angkor Motors" />
    )

  it("offers only the reasons the backend returns and posts the chosen reason id with details", async () => {
    getSellerReportReasons.mockResolvedValue([
      { id: "reason-1", label: "Spam or Advertising", description: null },
    ])
    reportSeller.mockResolvedValue(undefined)
    const { queryClient } = renderDialog()
    const invalidate = vi.spyOn(queryClient, "invalidateQueries")

    expect(await screen.findByText("Spam or Advertising")).toBeInTheDocument()
    expect(screen.queryByText(/scammer|impersonation|prohibited/i)).toBeNull()

    const submit = screen.getByRole("button", { name: "Submit report" })
    expect(submit).toBeDisabled()
    fireEvent.click(screen.getByRole("radio", { name: /Spam or Advertising/ }))
    fireEvent.change(screen.getByLabelText("Additional details"), { target: { value: " keeps spamming " } })
    fireEvent.click(submit)

    await waitFor(() =>
      expect(reportSeller).toHaveBeenCalledWith(SELLER.id, { reasonId: "reason-1", details: "keeps spamming" })
    )
    expect(await screen.findByText("Report received")).toBeInTheDocument()
    expect(invalidate).not.toHaveBeenCalled()
  })

  it("shows the backend message on a duplicate report", async () => {
    getSellerReportReasons.mockResolvedValue([{ id: "reason-1", label: "Spam", description: null }])
    reportSeller.mockRejectedValue(
      new ApiError(400, { code: "DUPLICATE_REPORT", message: "You already have an unresolved report pending for this seller" })
    )
    renderDialog()
    fireEvent.click(await screen.findByRole("radio", { name: /Spam/ }))
    fireEvent.click(screen.getByRole("button", { name: "Submit report" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("already have an unresolved report")
  })
})
