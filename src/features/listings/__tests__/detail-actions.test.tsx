import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { QueryClient } from "@tanstack/react-query"
import { renderWithProviders } from "@/test/test-utils"

const push = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/listing/x",
}))

let authenticated = true
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: authenticated, isLoading: false }),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const api = {
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  getReportReasons: vi.fn(),
  reportListing: vi.fn(),
  startConversation: vi.fn(),
  createOffer: vi.fn(),
}
vi.mock("../api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("../api/listing-detail.api")>()),
  addFavorite: (...a: unknown[]) => api.addFavorite(...a),
  removeFavorite: (...a: unknown[]) => api.removeFavorite(...a),
  getReportReasons: (...a: unknown[]) => api.getReportReasons(...a),
  reportListing: (...a: unknown[]) => api.reportListing(...a),
  startConversation: (...a: unknown[]) => api.startConversation(...a),
  createOffer: (...a: unknown[]) => api.createOffer(...a),
}))

import { FavoriteButton } from "../components/favorite-button"
import { ListingReportDialog } from "../components/detail/listing-report-dialog"
import { ListingMakeOfferDialog } from "../components/detail/listing-make-offer-dialog"
import { patchFavoriteInData } from "../lib/favorite-cache"
import { marketplaceKeys } from "@/lib/query/keys"

beforeEach(() => {
  push.mockReset()
  authenticated = true
  Object.values(api).forEach((fn) => fn.mockReset())
})

describe("patchFavoriteInData (cache updates)", () => {
  it("updates the detail DTO, home, similar arrays and infinite search pages", () => {
    const flag = (id: string, isFavorited: boolean) => ({ id, isFavorited, title: id })
    const patched = (data: unknown) => patchFavoriteInData(data, "L1", true)

    expect(patched(flag("L1", false))).toEqual(flag("L1", true))
    expect(patched([flag("L1", false), flag("L2", false)])).toEqual([flag("L1", true), flag("L2", false)])
    expect(patched({ newListings: [flag("L1", false)], banners: [] })).toMatchObject({
      newListings: [flag("L1", true)],
    })
    expect(
      patched({ pages: [{ items: [flag("L2", false)] }, { items: [flag("L1", false)] }], pageParams: [1, 2] })
    ).toMatchObject({ pages: [{ items: [flag("L2", false)] }, { items: [flag("L1", true)] }] })
    expect(patched({ unrelated: true })).toEqual({ unrelated: true })
    expect(patched(null)).toBeNull()
  })
})

describe("<FavoriteButton />", () => {
  it("sends a signed-out visitor to login with the current page as next", () => {
    authenticated = false
    renderWithProviders(<FavoriteButton listingId="L1" />)

    fireEvent.click(screen.getByRole("button", { name: "Save to favorites" }))
    expect(push).toHaveBeenCalledWith(expect.stringMatching(/^\/login\?next=/))
    expect(api.addFavorite).not.toHaveBeenCalled()
  })

  it("adds a favorite optimistically and calls the backend", async () => {
    api.addFavorite.mockResolvedValue(undefined)
    renderWithProviders(<FavoriteButton listingId="L1" />)

    fireEvent.click(screen.getByRole("button", { name: "Save to favorites" }))
    expect(screen.getByRole("button", { name: "Remove from favorites" })).toBeInTheDocument()
    await waitFor(() => expect(api.addFavorite).toHaveBeenCalledWith("L1"))
  })

  it("removes an existing favorite", async () => {
    api.removeFavorite.mockResolvedValue(undefined)
    renderWithProviders(<FavoriteButton listingId="L1" initialFavorited />)

    fireEvent.click(screen.getByRole("button", { name: "Remove from favorites" }))
    await waitFor(() => expect(api.removeFavorite).toHaveBeenCalledWith("L1"))
    expect(screen.getByRole("button", { name: "Save to favorites" })).toBeInTheDocument()
  })

  it("rolls back the optimistic state and the caches when the request fails", async () => {
    api.addFavorite.mockRejectedValue(new Error("boom"))
    const queryClient = new QueryClient()
    queryClient.setQueryData(marketplaceKeys.listings.detail("L1"), { id: "L1", isFavorited: false })
    renderWithProviders(<FavoriteButton listingId="L1" />, { queryClient })

    fireEvent.click(screen.getByRole("button", { name: "Save to favorites" }))
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save to favorites" })).toBeInTheDocument()
    )
    expect(queryClient.getQueryData(marketplaceKeys.listings.detail("L1"))).toEqual({
      id: "L1",
      isFavorited: false,
    })
  })

  it("updates the cached listing detail optimistically", async () => {
    api.addFavorite.mockResolvedValue(undefined)
    const queryClient = new QueryClient()
    queryClient.setQueryData(marketplaceKeys.listings.detail("L1"), { id: "L1", isFavorited: false })
    renderWithProviders(<FavoriteButton listingId="L1" />, { queryClient })

    fireEvent.click(screen.getByRole("button", { name: "Save to favorites" }))
    await waitFor(() =>
      expect(queryClient.getQueryData(marketplaceKeys.listings.detail("L1"))).toEqual({
        id: "L1",
        isFavorited: true,
      })
    )
  })
})

describe("<ListingReportDialog />", () => {
  const renderDialog = () =>
    renderWithProviders(
      <ListingReportDialog open onOpenChange={vi.fn()} listingId="L1" listingTitle="Prius" />
    )

  it("lists the backend's report reasons, not a hardcoded set", async () => {
    api.getReportReasons.mockResolvedValue([
      { id: "r1", label: "Backend reason one", description: null },
      { id: "r2", label: "Backend reason two", description: "More detail" },
    ])
    renderDialog()

    expect(await screen.findByText("Backend reason one")).toBeInTheDocument()
    expect(screen.getByText("Backend reason two")).toBeInTheDocument()
    expect(screen.queryByText(/scam or fraudulent/i)).toBeNull()
    expect(api.getReportReasons).toHaveBeenCalledWith("listing")
  })

  it("submits the reason id and optional details for this listing", async () => {
    api.getReportReasons.mockResolvedValue([{ id: "r1", label: "Spam", description: null }])
    api.reportListing.mockResolvedValue(undefined)
    renderDialog()

    fireEvent.click(await screen.findByLabelText("Spam"))
    fireEvent.change(screen.getByLabelText("Additional details"), { target: { value: " looks fake " } })
    fireEvent.click(screen.getByRole("button", { name: "Submit Report" }))

    await waitFor(() =>
      expect(api.reportListing).toHaveBeenCalledWith("L1", { reasonId: "r1", details: "looks fake" })
    )
    expect(await screen.findByText("Report Received")).toBeInTheDocument()
  })

  it("keeps submit disabled until a reason is chosen and shows backend errors", async () => {
    api.getReportReasons.mockResolvedValue([{ id: "r1", label: "Spam", description: null }])
    api.reportListing.mockRejectedValue(new Error("boom"))
    renderDialog()

    const reason = await screen.findByLabelText("Spam")
    const submit = screen.getByRole("button", { name: "Submit Report" })
    expect(submit).toBeDisabled()
    fireEvent.click(reason)
    fireEvent.click(submit)

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't submit/i)
    expect(screen.queryByText("Report Received")).toBeNull()
  })
})

describe("<ListingMakeOfferDialog />", () => {
  const renderOffer = () =>
    renderWithProviders(
      <ListingMakeOfferDialog
        open
        onOpenChange={vi.fn()}
        listingId="L1"
        listingTitle="Prius"
        askingPrice={20000}
        currency="USD"
      />
    )

  it("starts the real conversation and then sends the offer in the listing currency", async () => {
    api.startConversation.mockResolvedValue({ id: "C1" })
    api.createOffer.mockResolvedValue(undefined)
    renderOffer()

    fireEvent.change(screen.getByLabelText(/your offer/i), { target: { value: "18000" } })
    fireEvent.click(screen.getByRole("button", { name: "Send Offer" }))

    await waitFor(() => expect(api.createOffer).toHaveBeenCalledWith("C1", { amount: 18000, currency: "USD" }))
    expect(api.startConversation).toHaveBeenCalledWith("L1")
    expect(await screen.findByText("Offer sent")).toBeInTheDocument()
  })

  it("does not submit an empty or non-positive amount and never fakes success on failure", async () => {
    api.startConversation.mockRejectedValue(new Error("nope"))
    renderOffer()

    expect(screen.getByRole("button", { name: "Send Offer" })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/your offer/i), { target: { value: "0" } })
    expect(screen.getByRole("button", { name: "Send Offer" })).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/your offer/i), { target: { value: "100" } })
    fireEvent.click(screen.getByRole("button", { name: "Send Offer" }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i)
    expect(screen.queryByText("Offer sent")).toBeNull()
    expect(api.createOffer).not.toHaveBeenCalled()
  })
})
