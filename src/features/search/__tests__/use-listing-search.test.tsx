import { describe, expect, it, vi, beforeEach } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import type { ListingSearchInput, ListingSearchPage } from "@/features/listings/api/listings.api"

const searchListings = vi.fn()
vi.mock("@/features/listings/api/listings.api", async (orig) => ({
  ...(await orig<typeof import("@/features/listings/api/listings.api")>()),
  searchListings: (input: ListingSearchInput, page: number) => searchListings(input, page),
}))

import { useListingSearch } from "../hooks/use-listing-search"

const page = (n: number, totalPages: number): ListingSearchPage => ({
  items: [{ id: `listing-${n}` } as ListingSearchPage["items"][number]],
  pagination: { page: n, limit: 12, total: 24, totalPages },
})

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return Wrapper
}

describe("useListingSearch pagination", () => {
  beforeEach(() => searchListings.mockReset())

  it("loads backend pages one at a time and stops at the last page", async () => {
    searchListings.mockImplementation(async (_input, n: number) => page(n, 2))
    const input: ListingSearchInput = { sort: "newest", category: "cars" }

    const { result } = renderHook(() => useListingSearch(input), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(1))
    expect(searchListings).toHaveBeenLastCalledWith(input, 1)
    expect(result.current.hasNextPage).toBe(true)

    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))
    expect(searchListings).toHaveBeenLastCalledWith(input, 2)
    expect(result.current.data?.pages.flatMap((p) => p.items.map((i) => i.id))).toEqual([
      "listing-1",
      "listing-2",
    ])
    expect(result.current.hasNextPage).toBe(false)
    expect(searchListings).toHaveBeenCalledTimes(2)
  })

  it("has no next page for empty results", async () => {
    searchListings.mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    })

    const { result } = renderHook(() => useListingSearch({ sort: "newest" }), {
      wrapper: wrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.pages[0]?.items).toEqual([])
    expect(result.current.hasNextPage).toBe(false)
  })

  it("does not fetch while disabled (waiting for field definitions)", () => {
    renderHook(() => useListingSearch({ sort: "newest" }, false), { wrapper: wrapper() })
    expect(searchListings).not.toHaveBeenCalled()
  })

  it("keeps previous results visible while new filters load", async () => {
    let resolveSecond: (value: ListingSearchPage) => void = () => {}
    searchListings.mockImplementationOnce(async () => page(1, 1))
    searchListings.mockImplementationOnce(
      () => new Promise<ListingSearchPage>((resolve) => (resolveSecond = resolve))
    )

    const { result, rerender } = renderHook(
      ({ input }: { input: ListingSearchInput }) => useListingSearch(input),
      { wrapper: wrapper(), initialProps: { input: { sort: "newest" } } }
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    rerender({ input: { sort: "price_asc" } })

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true))
    expect(result.current.data?.pages[0]?.items[0]?.id).toBe("listing-1")

    await act(async () => resolveSecond(page(1, 1)))
  })
})
