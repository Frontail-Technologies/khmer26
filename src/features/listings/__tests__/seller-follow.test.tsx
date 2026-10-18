import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { useQuery } from "@tanstack/react-query"
import { renderWithProviders, createTestQueryClient } from "@/test/test-utils"
import { ApiError } from "@/lib/api/client"
import { marketplaceKeys } from "@/lib/query/keys"
import { makeDetail } from "./detail-fixtures"

vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => (k ? `https://cdn.test/${k}` : null),
}))
const push = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/listing/x",
}))

let signedIn = true
/** Stand-in for the backend: what GET /listings/:id reports after follow/unfollow calls. */
let serverFollowing = false
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: signedIn, isLoading: false, user: signedIn ? { email: "a@b.c" } : null }),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const followSeller = vi.fn()
const unfollowSeller = vi.fn()
vi.mock("../api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("../api/listing-detail.api")>()),
  followSeller: (...a: unknown[]) => followSeller(...a),
  unfollowSeller: (...a: unknown[]) => unfollowSeller(...a),
}))

import { ListingSellerCard } from "../components/detail/listing-seller-card"
import type { ListingDetail } from "../api/listing-detail.api"

const detail = (isFollowing: boolean, isOwner = false) =>
  makeDetail({ isOwner, seller: { ...makeDetail().seller!, isFollowing } })

/** Reads the seller from the listing-detail cache like the real page does. */
function Harness({ id }: { id: string }) {
  const { data } = useQuery<ListingDetail>({
    queryKey: marketplaceKeys.listings.detail(id),
    queryFn: async () => detail(serverFollowing),
    staleTime: Infinity,
  })
  if (!data?.seller) return null
  return <ListingSellerCard seller={data.seller} listingId={data.id} isOwner={data.isOwner} />
}

function setup(initial: ListingDetail) {
  serverFollowing = initial.seller?.isFollowing ?? false
  const queryClient = createTestQueryClient()
  queryClient.setQueryData(marketplaceKeys.listings.detail(initial.id), initial)
  renderWithProviders(<Harness id={initial.id} />, { queryClient })
  return queryClient
}

beforeEach(() => {
  followSeller.mockReset()
  unfollowSeller.mockReset()
  push.mockReset()
  signedIn = true
})

describe("Follow", () => {
  it("follows through the backend using the seller profile id and flips to Following", async () => {
    followSeller.mockImplementation(async () => {
      serverFollowing = true
    })
    const initial = detail(false)
    const queryClient = setup(initial)

    fireEvent.click(screen.getByRole("button", { name: "Follow" }))

    expect(await screen.findByRole("button", { name: "Following" })).toBeInTheDocument()
    expect(followSeller).toHaveBeenCalledWith("s1")
    expect(unfollowSeller).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(queryClient.getQueryData<ListingDetail>(marketplaceKeys.listings.detail(initial.id))?.seller?.isFollowing).toBe(true)
    )
  })

  it("starts as Following when the backend says so, and unfollows", async () => {
    unfollowSeller.mockImplementation(async () => {
      serverFollowing = false
    })
    setup(detail(true))

    const button = screen.getByRole("button", { name: "Following" })
    expect(button).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(button)

    expect(await screen.findByRole("button", { name: "Follow" })).toBeInTheDocument()
    expect(unfollowSeller).toHaveBeenCalledWith("s1")
    expect(followSeller).not.toHaveBeenCalled()
  })

  it("rolls back to the previous state when the backend rejects the change", async () => {
    followSeller.mockRejectedValue(new ApiError(500, { code: "INTERNAL", message: "boom" }))
    setup(detail(false))

    fireEvent.click(screen.getByRole("button", { name: "Follow" }))

    await waitFor(() => expect(followSeller).toHaveBeenCalled())
    expect(await screen.findByRole("button", { name: "Follow" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Following" })).toBeNull()
  })

  it("sends signed-out visitors to login instead of faking the state", () => {
    signedIn = false
    setup(detail(false))

    fireEvent.click(screen.getByRole("button", { name: "Follow" }))

    expect(followSeller).not.toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith(expect.stringContaining("/login"))
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument()
  })

  it("is not offered to the seller on their own listing", () => {
    setup(detail(false, true))
    expect(screen.queryByRole("button", { name: /follow/i })).toBeNull()
  })

  it("does not invent a username or show a raw id as a handle", () => {
    const { container } = renderWithProviders(
      <ListingSellerCard seller={detail(false).seller!} listingId="l1" isOwner={false} />
    )
    expect(container.textContent).not.toMatch(/@\w/)
  })
})
