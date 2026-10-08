import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { act, fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { linkTree, node } from "@/features/categories/__tests__/fixtures"
import type { PublicListing } from "@/features/listings/api/listings.api"

const push = vi.fn()
let pathname = "/"
let search = ""
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(search),
}))

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => getMediaUrl(k),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const getCategoryTree = vi.fn()
vi.mock("@/features/categories/api/categories.api", async (orig) => ({
  ...(await orig<typeof import("@/features/categories/api/categories.api")>()),
  getCategoryTree: () => getCategoryTree(),
}))

const searchListings = vi.fn()
vi.mock("@/features/listings/api/listings.api", async (orig) => ({
  ...(await orig<typeof import("@/features/listings/api/listings.api")>()),
  searchListings: (...args: unknown[]) => searchListings(...args),
}))

import { SearchBar } from "../SearchBar"

const tree = () =>
  linkTree([
    node("vehicles", [
      node("cars", [node("toyota", [node("hybrid")])], { imageR2Key: "categories/cars.png" }),
      node("motorcycles", [], { nameEn: "Yamaha Motorcycles" }),
    ]),
    node("property", [node("land")]),
  ])

const listing = (id: string, title: string): PublicListing =>
  ({
    id,
    title,
    price: "3150.00",
    currency: "USD",
    location: { province: { id: 1, nameEn: "Phnom Penh", nameKm: null }, district: null, commune: null },
  }) as PublicListing

function typeInto(value: string) {
  const input = screen.getByRole("combobox", { name: "Search listings" })
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value } })
  return input
}

describe("<SearchBar /> header category selector", () => {
  beforeEach(() => {
    push.mockReset()
    pathname = "/"
    search = ""
    getCategoryTree.mockReset().mockResolvedValue(tree())
    searchListings.mockReset().mockResolvedValue({ items: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } })
    getMediaUrl.mockClear()
  })

  it("shows category thumbnails from imageR2Key and falls back to an icon when missing", async () => {
    renderWithProviders(<SearchBar />)
    fireEvent.click(screen.getByRole("button", { name: "Select category" }))

    const thumb = await waitFor(() => {
      const img = document.querySelector('img[src="https://cdn.test/categories/cars.png"]')
      expect(img).not.toBeNull()
      return img
    })
    expect(thumb).toBeInTheDocument()
    expect(getMediaUrl).toHaveBeenCalledWith("categories/cars.png")
    expect(document.querySelectorAll("img")).toHaveLength(1)
  })

  it("preserves the real hierarchy at any depth", async () => {
    renderWithProviders(<SearchBar />)
    fireEvent.click(screen.getByRole("button", { name: "Select category" }))

    for (const name of ["Vehicles", "Cars", "Toyota", "Hybrid", "Yamaha Motorcycles", "Property", "Land"]) {
      expect(await screen.findByRole("option", { name })).toBeInTheDocument()
    }
    const padding = (name: string) =>
      Number.parseFloat(screen.getByRole("option", { name }).style.paddingLeft)
    expect(padding("Vehicles")).toBeLessThan(padding("Cars"))
    expect(padding("Cars")).toBeLessThan(padding("Toyota"))
    expect(padding("Toyota")).toBeLessThan(padding("Hybrid"))
  })

  it("derives the label from the route and search params (root, child, deep, none)", async () => {
    pathname = "/category/vehicles"
    const { unmount } = renderWithProviders(<SearchBar />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("Vehicles")
    )
    unmount()

    pathname = "/category/vehicles/cars"
    const second = renderWithProviders(<SearchBar />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("Cars")
    )
    second.unmount()

    pathname = "/search"
    search = "category=hybrid&q=prius"
    const third = renderWithProviders(<SearchBar />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("Hybrid")
    )
    expect(screen.getByRole("combobox", { name: "Search listings" })).toHaveValue("prius")
    third.unmount()

    pathname = "/"
    search = ""
    renderWithProviders(<SearchBar />)
    expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("All Categories")
  })

  it("does not keep a stale parent after choosing a child, and 'All Categories' clears it", async () => {
    pathname = "/category/vehicles"
    renderWithProviders(<SearchBar />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("Vehicles")
    )

    fireEvent.click(screen.getByRole("button", { name: "Select category" }))
    fireEvent.click(await screen.findByRole("option", { name: "Toyota" }))
    expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("Toyota")

    fireEvent.click(screen.getByRole("button", { name: "Select category" }))
    fireEvent.click(screen.getByRole("option", { name: "All Categories" }))
    expect(screen.getByRole("button", { name: "Select category" })).toHaveTextContent("All Categories")
  })

  it("scopes a keyword search to the selected category", async () => {
    renderWithProviders(<SearchBar />)
    fireEvent.click(screen.getByRole("button", { name: "Select category" }))
    fireEvent.click(await screen.findByRole("option", { name: "Cars" }))

    const input = screen.getByRole("combobox", { name: "Search listings" })
    fireEvent.change(input, { target: { value: "prius" } })
    fireEvent.submit(input.closest("form")!)

    expect(push).toHaveBeenCalledWith("/search?q=prius&category=cars")
  })
})

describe("<SearchBar /> autosuggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    push.mockReset()
    pathname = "/"
    search = ""
    getCategoryTree.mockReset().mockResolvedValue(tree())
    searchListings.mockReset().mockResolvedValue({
      items: [listing("l1", "Yamaha Aerox 155 Connected 2023"), listing("l2", "Yamaha NMAX")],
      pagination: { page: 1, limit: 5, total: 2, totalPages: 1 },
    })
  })
  afterEach(() => vi.useRealTimers())

  it("debounces requests, skips short input, and queries /listings with a small limit", async () => {
    renderWithProviders(<SearchBar />)
    await screen.findByRole("combobox", { name: "Search listings" })

    typeInto("y")
    await act(async () => vi.advanceTimersByTime(600))
    expect(searchListings).not.toHaveBeenCalled()

    typeInto("ya")
    typeInto("yam")
    await act(async () => vi.advanceTimersByTime(200))
    expect(searchListings).not.toHaveBeenCalled()

    await act(async () => vi.advanceTimersByTime(200))
    await waitFor(() => expect(searchListings).toHaveBeenCalledTimes(1))
    expect(searchListings).toHaveBeenCalledWith(
      { q: "yam", category: undefined, sort: "newest" },
      1,
      5
    )

    typeInto("")
    await act(async () => vi.advanceTimersByTime(600))
    expect(searchListings).toHaveBeenCalledTimes(1)
  })

  it("shows real category and listing suggestions", async () => {
    renderWithProviders(<SearchBar />)
    await screen.findByRole("combobox", { name: "Search listings" })
    typeInto("yamaha")
    await act(async () => vi.advanceTimersByTime(400))

    expect(await screen.findByRole("option", { name: /Yamaha Motorcycles/ })).toBeInTheDocument()
    expect(await screen.findByRole("option", { name: /Yamaha Aerox 155 Connected 2023/ })).toBeInTheDocument()
    expect(screen.getAllByText("$3,150 · Phnom Penh", { exact: false })).toHaveLength(2)
  })

  it("navigates with ArrowDown/ArrowUp and selects with Enter (category and listing)", async () => {
    renderWithProviders(<SearchBar />)
    await screen.findByRole("combobox", { name: "Search listings" })
    const input = typeInto("yamaha")
    await act(async () => vi.advanceTimersByTime(400))
    await screen.findByRole("option", { name: /Yamaha NMAX/ })

    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(screen.getAllByRole("option", { selected: true })[0]).toHaveTextContent("Yamaha Motorcycles")
    fireEvent.keyDown(input, { key: "Enter" })
    expect(push).toHaveBeenLastCalledWith("/category/vehicles/motorcycles")

    typeInto("yamaha")
    await act(async () => vi.advanceTimersByTime(400))
    await screen.findByRole("option", { name: /Yamaha NMAX/ })
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(screen.getAllByRole("option", { selected: true })[0]).toHaveTextContent("Yamaha NMAX")
    fireEvent.keyDown(input, { key: "Enter" })
    expect(push).toHaveBeenLastCalledWith("/listing/l2")
  })

  it("Enter with no highlighted suggestion submits the raw keyword", async () => {
    renderWithProviders(<SearchBar />)
    await screen.findByRole("combobox", { name: "Search listings" })
    const input = typeInto("honda dream")
    await act(async () => vi.advanceTimersByTime(400))

    fireEvent.keyDown(input, { key: "Enter" })
    fireEvent.submit(input.closest("form")!)
    expect(push).toHaveBeenLastCalledWith("/search?q=honda+dream")
  })

  it("Escape and an outside click close the suggestions", async () => {
    renderWithProviders(<SearchBar />)
    await screen.findByRole("combobox", { name: "Search listings" })
    const input = typeInto("yamaha")
    await act(async () => vi.advanceTimersByTime(400))
    await screen.findByRole("listbox", { name: "Search suggestions" })

    fireEvent.keyDown(input, { key: "Escape" })
    expect(screen.queryByRole("listbox", { name: "Search suggestions" })).toBeNull()

    typeInto("yamaha2")
    await act(async () => vi.advanceTimersByTime(400))
    await screen.findByRole("listbox", { name: "Search suggestions" })
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole("listbox", { name: "Search suggestions" })).toBeNull()
  })

  it("shows nothing quietly when there are no matches", async () => {
    searchListings.mockResolvedValue({ items: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } })
    renderWithProviders(<SearchBar />)
    await screen.findByRole("combobox", { name: "Search listings" })
    typeInto("zzzzz")
    await act(async () => vi.advanceTimersByTime(600))
    await waitFor(() => expect(searchListings).toHaveBeenCalled())
    expect(screen.queryByRole("listbox", { name: "Search suggestions" })).toBeNull()
  })
})
