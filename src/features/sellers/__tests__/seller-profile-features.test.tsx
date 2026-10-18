import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor, act } from "@testing-library/react"
import { renderWithProviders, createTestQueryClient } from "@/test/test-utils"
import { ApiError } from "@/lib/api/client"
import { marketplaceKeys } from "@/lib/query/keys"
import { makeDetail } from "@/features/listings/__tests__/detail-fixtures"
import { makeListing, makeSeller, pagination } from "./seller-fixtures"

vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => (k ? `https://cdn.test/${k}` : null),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
const push = vi.fn()
const replace = vi.fn()
let searchParams = new URLSearchParams()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace, back: vi.fn() }),
  usePathname: () => "/seller/s1",
  useSearchParams: () => searchParams,
}))
let signedIn = true
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ user: null, isAuthenticated: signedIn, isLoading: false }),
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => {
    if (!signedIn) {
      push("/login?next=%2Fseller%2Fs1")
      return undefined
    }
    return action()
  },
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const getSeller = vi.fn()
const getSellerListingsPage = vi.fn()
const getSellerReviewsPage = vi.fn()
const getSellerCategories = vi.fn()
const revealSellerContacts = vi.fn()
vi.mock("../api/sellers.api", async (orig) => ({
  ...(await orig<typeof import("../api/sellers.api")>()),
  getSeller: (...a: unknown[]) => getSeller(...a),
  getSellerListingsPage: (...a: unknown[]) => getSellerListingsPage(...a),
  getSellerReviewsPage: (...a: unknown[]) => getSellerReviewsPage(...a),
  getSellerCategories: (...a: unknown[]) => getSellerCategories(...a),
  revealSellerContacts: (...a: unknown[]) => revealSellerContacts(...a),
}))

const followSeller = vi.fn()
const unfollowSeller = vi.fn()
vi.mock("@/features/listings/api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("@/features/listings/api/listing-detail.api")>()),
  followSeller: (...a: unknown[]) => followSeller(...a),
  unfollowSeller: (...a: unknown[]) => unfollowSeller(...a),
  startConversation: vi.fn(),
}))

import { SellerProfileContent } from "../components/seller-profile-content"

const SELLER_ID = "11111111-1111-4111-8111-111111111111"
const TWO_CONTACTS = [
  { id: "c1", type: "phone" as const, valueMasked: "086225xxx", carrier: "smart" as const },
  { id: "c2", type: "phone" as const, valueMasked: "0887883xxx", carrier: null },
]

let serverFollowing = false

function setup({
  seller = makeSeller(),
  listings = [makeListing("l1", "Prius"), makeListing("l2", "Camry")],
  categories = [] as Array<{ id: string; nameEn: string; nameKm: null; slug: string; count: number }>,
} = {}) {
  serverFollowing = seller.isFollowing
  getSeller.mockImplementation(async () => ({ ...seller, isFollowing: serverFollowing }))
  getSellerListingsPage.mockResolvedValue({ items: listings, pagination: pagination(1, listings.length) })
  getSellerReviewsPage.mockResolvedValue({ items: [], pagination: pagination(1, 0, 10) })
  getSellerCategories.mockResolvedValue(categories)
  const queryClient = createTestQueryClient()
  renderWithProviders(<SellerProfileContent id={seller.id} />, { queryClient })
  return queryClient
}

const heading = async () => (await screen.findAllByRole("heading", { level: 1 })).at(-1)!

beforeEach(() => {
  for (const fn of [getSeller, getSellerListingsPage, getSellerReviewsPage, getSellerCategories, revealSellerContacts, followSeller, unfollowSeller, push, replace]) {
    fn.mockReset()
  }
  searchParams = new URLSearchParams()
  signedIn = true
})

describe("seller contact card", () => {
  it("shows masked numbers and the product-style profile address, never the full number or localhost", async () => {
    setup({ seller: makeSeller({ contacts: TWO_CONTACTS }) })
    await heading()
    expect(await screen.findByText("086225xxx")).toBeInTheDocument()
    expect(screen.getByText("0887883xxx")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Smart" })).toBeInTheDocument()
    expect(screen.getByText(`khmer26.com/seller/${SELLER_ID}`)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/localhost|086225333|0887883333/)
  })

  it("reveals through the seller endpoint once and replaces every masked value", async () => {
    revealSellerContacts.mockResolvedValue([
      { id: "c1", type: "phone", value: "086225333", carrier: "smart" },
      { id: "c2", type: "phone", value: "0887883333", carrier: null },
    ])
    setup({ seller: makeSeller({ contacts: TWO_CONTACTS }) })

    fireEvent.click(await screen.findByRole("button", { name: "Show Phone Number" }))

    expect(await screen.findByText("086 225 333")).toBeInTheDocument()
    expect(screen.getByText("088 788 3333")).toBeInTheDocument()
    expect(revealSellerContacts).toHaveBeenCalledTimes(1)
    expect(revealSellerContacts).toHaveBeenCalledWith(SELLER_ID)
    expect(screen.queryByRole("button", { name: "Show Phone Number" })).toBeNull()
  })

  it("shows the backend error (e.g. rate limit) and keeps the numbers masked", async () => {
    revealSellerContacts.mockRejectedValue(
      new ApiError(429, { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later." })
    )
    setup({ seller: makeSeller({ contacts: TWO_CONTACTS }) })

    fireEvent.click(await screen.findByRole("button", { name: "Show Phone Number" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many requests")
    expect(screen.getByText("086225xxx")).toBeInTheDocument()
  })

  it("has no contact numbers or reveal action when the seller has none", async () => {
    setup()
    await heading()
    expect(screen.queryByRole("button", { name: "Show Phone Number" })).toBeNull()
  })
})

describe("Follow on the seller page", () => {
  it("follows through the backend and shows Following", async () => {
    followSeller.mockImplementation(async () => {
      serverFollowing = true
    })
    setup()
    fireEvent.click(await screen.findByRole("button", { name: "Follow" }))

    expect(await screen.findByRole("button", { name: "Following" })).toBeInTheDocument()
    expect(followSeller).toHaveBeenCalledWith(SELLER_ID)
  })

  it("starts as Following from the backend state and unfollows", async () => {
    unfollowSeller.mockImplementation(async () => {
      serverFollowing = false
    })
    setup({ seller: makeSeller({ isFollowing: true }) })
    const button = await screen.findByRole("button", { name: "Following" })
    expect(button).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(button)

    expect(await screen.findByRole("button", { name: "Follow" })).toBeInTheDocument()
    expect(unfollowSeller).toHaveBeenCalledWith(SELLER_ID)
  })

  it("rolls back when the backend rejects the change", async () => {
    followSeller.mockRejectedValue(new ApiError(500, { code: "INTERNAL", message: "boom" }))
    setup()
    fireEvent.click(await screen.findByRole("button", { name: "Follow" }))
    await waitFor(() => expect(followSeller).toHaveBeenCalled())
    expect(await screen.findByRole("button", { name: "Follow" })).toBeInTheDocument()
  })

  it("sends signed-out visitors to login without touching the backend", async () => {
    signedIn = false
    setup()
    fireEvent.click(await screen.findByRole("button", { name: "Follow" }))
    expect(followSeller).not.toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith(expect.stringContaining("/login"))
  })

  it("is not offered on your own profile", async () => {
    setup({ seller: makeSeller({ isOwner: true }) })
    await heading()
    expect(screen.queryByRole("button", { name: /follow/i })).toBeNull()
  })

  it("keeps the listing-detail cache in sync, so the listing page shows the same state", async () => {
    followSeller.mockImplementation(async () => {
      serverFollowing = true
    })
    const queryClient = createTestQueryClient()
    const listing = makeDetail({ seller: { ...makeDetail().seller!, id: SELLER_ID, isFollowing: false } })
    queryClient.setQueryData(marketplaceKeys.listings.detail(listing.id), listing)

    serverFollowing = false
    getSeller.mockImplementation(async () => ({ ...makeSeller(), isFollowing: serverFollowing }))
    getSellerListingsPage.mockResolvedValue({ items: [makeListing("l1")], pagination: pagination(1, 1) })
    getSellerReviewsPage.mockResolvedValue({ items: [], pagination: pagination(1, 0, 10) })
    getSellerCategories.mockResolvedValue([])
    renderWithProviders(<SellerProfileContent id={SELLER_ID} />, { queryClient })

    fireEvent.click(await screen.findByRole("button", { name: "Follow" }))

    await waitFor(() => {
      const cached = queryClient.getQueryData<ReturnType<typeof makeDetail>>(marketplaceKeys.listings.detail(listing.id))
      expect(cached?.seller?.isFollowing).toBe(true)
    })
    // The cached listing detail is marked stale so it refetches the backend truth.
    expect(queryClient.getQueryState(marketplaceKeys.listings.detail(listing.id))?.isInvalidated).toBe(true)
  })
})

describe("seller inventory filters (URL-driven)", () => {
  const categories = [
    { id: "cat-cars", nameEn: "Cars", nameKm: null, slug: "cars", count: 2 },
    { id: "cat-phones", nameEn: "Phones", nameKm: null, slug: "phones", count: 1 },
  ]
  // The page also makes an unfiltered call (the Chat target), so pick the call that carries filters.
  const lastListingsCall = () => getSellerListingsPage.mock.calls.filter((c) => Object.keys(c[2] ?? {}).length > 0).at(-1)!

  it("reads filters from the URL and sends them to the backend", async () => {
    searchParams = new URLSearchParams("q=prius&category=cat-cars&sort=price_asc")
    setup({ seller: makeSeller({ listingCount: 3 }), categories })
    await screen.findAllByText("Prius")
    await waitFor(() => expect(getSellerListingsPage).toHaveBeenCalled())

    const [id, page, filters] = lastListingsCall()
    expect(id).toBe(SELLER_ID)
    expect(page).toEqual({ page: 1, limit: 12 })
    expect(filters).toEqual({ q: "prius", categoryId: "cat-cars", sort: "price_asc" })
    expect(screen.getByLabelText("Search this seller's listings")).toHaveValue("prius")
  })

  it("shows category chips with the real counts and writes the choice to the URL", async () => {
    setup({ seller: makeSeller({ listingCount: 3 }), categories })
    expect(await screen.findByRole("button", { name: "All (3)" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cars (2)" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Phones (1)" }))
    expect(replace).toHaveBeenCalledWith("/seller/s1?category=cat-phones", { scroll: false })
  })

  it("debounces the keyword into the URL", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      setup({ seller: makeSeller({ listingCount: 3 }), categories })
      const box = await screen.findByLabelText("Search this seller's listings")
      fireEvent.change(box, { target: { value: "civic" } })
      expect(replace).not.toHaveBeenCalled()
      await act(async () => {
        vi.advanceTimersByTime(400)
      })
      expect(replace).toHaveBeenCalledWith("/seller/s1?q=civic", { scroll: false })
    } finally {
      vi.useRealTimers()
    }
  })

  it("hides the category chips when the inventory is a single category", async () => {
    setup({ seller: makeSeller({ listingCount: 2 }), categories: [categories[0]!] })
    await screen.findAllByText("Prius")
    expect(screen.queryByRole("group", { name: "Filter by category" })).toBeNull()
  })

  it("explains an empty filtered result and clears all filters in the URL", async () => {
    searchParams = new URLSearchParams("q=zzz")
    setup({ seller: makeSeller({ listingCount: 3 }), listings: [], categories })

    expect(await screen.findByText("No listings match your search")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(replace).toHaveBeenCalledWith("/seller/s1", { scroll: false })
  })

  it("shows the plain empty state (no filter controls) for a seller with no inventory", async () => {
    setup({ seller: makeSeller({ listingCount: 0 }), listings: [] })
    expect(await screen.findByText("No active listings")).toBeInTheDocument()
    expect(screen.queryByLabelText("Search this seller's listings")).toBeNull()
  })
})
