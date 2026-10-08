import { describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import type { PublicListing } from "@/features/listings/api/listings.api"
import { DEFAULT_SORT, type SearchFilters } from "../lib/search-filters"
import type { SearchPageState } from "../hooks/use-search-page-state"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: false, isLoading: false }),
}))

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => getMediaUrl(k),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))
vi.mock("@/features/locations/api/locations.api", () => ({
  getProvinces: vi.fn().mockResolvedValue([]),
  getDistricts: vi.fn().mockResolvedValue([]),
  getCommunes: vi.fn().mockResolvedValue([]),
}))

import { SearchResultsView } from "../components/search-results-view"

vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

const listing = (overrides: Partial<PublicListing> = {}): PublicListing => ({
  id: "l1",
  title: "Backend Honda Dream",
  description: null,
  price: "1250.00",
  currency: "USD",
  status: "active",
  createdAt: new Date(Date.now() - 3600_000).toISOString(),
  updatedAt: new Date().toISOString(),
  category: { id: "c", nameEn: "Motorcycles", nameKm: null, slug: "motorcycles" },
  location: {
    province: { id: 1, nameEn: "Phnom Penh", nameKm: null },
    district: null,
    commune: null,
  },
  seller: null,
  primaryImage: { mediaId: "m", r2Key: "listings/dream.jpg", mimeType: "image/jpeg", sizeBytes: 1 },
  ...overrides,
})

const baseFilters: SearchFilters = { sort: DEFAULT_SORT, fields: {} }

function makeState(overrides: {
  items?: PublicListing[]
  total?: number
  filters?: Partial<SearchFilters>
  search?: Partial<SearchPageState["search"]>
  setFilters?: SearchPageState["setFilters"]
  isCategoryRoute?: boolean
}): SearchPageState {
  return {
    filters: { ...baseFilters, ...overrides.filters },
    setFilters: overrides.setFilters ?? vi.fn(),
    isCategoryRoute: overrides.isCategoryRoute ?? false,
    definitions: [],
    fieldsLoading: false,
    items: overrides.items ?? [],
    total: overrides.total,
    search: {
      isPending: false,
      isError: false,
      isPlaceholderData: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      refetch: vi.fn(),
      ...overrides.search,
    },
  } as unknown as SearchPageState
}

describe("<SearchResultsView />", () => {
  it("renders the canonical listing DTO through the shared listing card", () => {
    renderWithProviders(
      <SearchResultsView state={makeState({ items: [listing()], total: 1 })} />
    )

    expect(screen.getByRole("heading", { name: "Backend Honda Dream" })).toBeInTheDocument()
    expect(screen.getByText("$1,250")).toBeInTheDocument()
    expect(screen.getByText("Phnom Penh")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Backend Honda Dream" })).toHaveAttribute(
      "src",
      "https://cdn.test/listings/dream.jpg"
    )
    expect(getMediaUrl).toHaveBeenCalledWith("listings/dream.jpg")
    expect(screen.getByLabelText("Backend Honda Dream")).toHaveAttribute("href", "/listing/l1")
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("does not invent badges the backend did not return", () => {
    renderWithProviders(<SearchResultsView state={makeState({ items: [listing()], total: 1 })} />)
    expect(screen.queryByText(/featured|urgent|negotiable/i)).toBeNull()
    expect(screen.queryByLabelText("Verified Seller")).toBeNull()
  })

  it("shows the first-load skeleton while pending", () => {
    renderWithProviders(
      <SearchResultsView state={makeState({ search: { isPending: true } })} />
    )
    expect(screen.getByLabelText("Loading results")).toBeInTheDocument()
  })

  it("keeps existing results visible while refreshing after a filter change", () => {
    renderWithProviders(
      <SearchResultsView
        state={makeState({ items: [listing()], total: 1, search: { isPlaceholderData: true } })}
      />
    )
    expect(screen.getByRole("heading", { name: "Backend Honda Dream" })).toBeInTheDocument()
    expect(screen.queryByLabelText("Loading results")).toBeNull()
  })

  it("Clear all on /search clears keyword, category and every filter", () => {
    const setFilters = vi.fn()
    renderWithProviders(
      <SearchResultsView
        state={makeState({
          total: 0,
          filters: { q: "zzz", category: "cars", provinceId: 1, minPrice: 10 },
          setFilters,
        })}
        categoryChipLabel="Cars"
      />
    )

    expect(screen.getByText("No Result Found")).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole("button", { name: /clear all filters/i })[0]!)
    expect(setFilters).toHaveBeenCalledWith({ category: undefined, sort: DEFAULT_SORT, fields: {} })
  })

  it("Clear all on a category route clears filters but keeps the route's category", () => {
    const setFilters = vi.fn()
    renderWithProviders(
      <SearchResultsView
        state={makeState({
          total: 0,
          isCategoryRoute: true,
          filters: { q: "zzz", category: "cars", provinceId: 1, sort: "price_asc" },
          setFilters,
        })}
      />
    )

    fireEvent.click(screen.getAllByRole("button", { name: /clear all filters/i })[0]!)
    expect(setFilters).toHaveBeenCalledWith({ category: "cars", sort: DEFAULT_SORT, fields: {} })
  })

  it("the count comes from the backend total, not the number of loaded cards", () => {
    renderWithProviders(
      <SearchResultsView
        state={makeState({
          items: [listing()],
          total: 30,
          search: { hasNextPage: true },
        })}
      />
    )
    expect(screen.getByText("30")).toBeInTheDocument()
    expect(screen.queryByText(/^1$/)).toBeNull()
  })

  it("the sidebar badge, drawer button and chips use one count", () => {
    renderWithProviders(
      <SearchResultsView
        state={makeState({
          items: [listing()],
          total: 1,
          filters: { q: "honda", provinceId: 1, minPrice: 5 },
        })}
      />
    )
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByRole("button", { name: /^Remove filter/ })).toHaveLength(3)
  })

  it("uses the category empty state when only the category is selected", () => {
    renderWithProviders(
      <SearchResultsView
        state={makeState({ total: 0 })}
        categoryEmptyState={<div>Category is empty</div>}
      />
    )
    expect(screen.getByText("Category is empty")).toBeInTheDocument()
  })

  it("shows an error state with retry", () => {
    const refetch = vi.fn()
    renderWithProviders(
      <SearchResultsView state={makeState({ search: { isError: true, refetch } })} />
    )
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(refetch).toHaveBeenCalled()
  })

  it("loads the next backend page on demand", () => {
    const fetchNextPage = vi.fn()
    renderWithProviders(
      <SearchResultsView
        state={makeState({
          items: [listing()],
          total: 30,
          search: { hasNextPage: true, fetchNextPage },
        })}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Load more listings" }))
    expect(fetchNextPage).toHaveBeenCalled()
  })
})
