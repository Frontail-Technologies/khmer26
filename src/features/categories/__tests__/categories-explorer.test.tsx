import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { deepTree } from "./fixtures"

const getMediaUrl = vi.fn((key: string | null | undefined) => (key ? `https://cdn.test/${key}` : null))
vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => getMediaUrl(k),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const getCategoryTree = vi.fn()
vi.mock("../api/categories.api", async (orig) => ({
  ...(await orig<typeof import("../api/categories.api")>()),
  getCategoryTree: () => getCategoryTree(),
}))

import { CategoriesExplorer } from "../components/categories-explorer"

describe("<CategoriesExplorer />", () => {
  beforeEach(() => {
    getCategoryTree.mockReset()
    getMediaUrl.mockClear()
  })

  it("renders root categories from the backend and links to their category pages", async () => {
    const tree = deepTree()
    tree[0]!.imageR2Key = "categories/vehicles.png"
    getCategoryTree.mockResolvedValue(tree)
    renderWithProviders(<CategoriesExplorer />)

    const vehicles = await screen.findByRole("link", { name: /vehicles/i })
    expect(vehicles).toHaveAttribute("href", "/category/vehicles")
    expect(screen.getByRole("link", { name: /property/i })).toHaveAttribute("href", "/category/property")
  })

  it("resolves category media keys through getMediaUrl and uses a placeholder when missing", async () => {
    const tree = deepTree()
    tree[0]!.imageR2Key = "categories/vehicles.png"
    getCategoryTree.mockResolvedValue(tree)
    renderWithProviders(<CategoriesExplorer />)

    await screen.findByRole("link", { name: /vehicles/i })
    const image = document.querySelector('img[src="https://cdn.test/categories/vehicles.png"]')
    expect(image).not.toBeNull()
    expect(getMediaUrl).toHaveBeenCalledWith("categories/vehicles.png")
    expect(document.querySelectorAll("img")).toHaveLength(1)
    expect(screen.getByText("P")).toBeInTheDocument()
  })

  it("does not show invented listing counts or hardcoded category copy", async () => {
    getCategoryTree.mockResolvedValue(deepTree())
    renderWithProviders(<CategoriesExplorer />)
    await screen.findByRole("link", { name: /vehicles/i })

    expect(screen.queryByText(/\bads\b/i)).toBeNull()
    expect(screen.queryByText(/12 major categories/i)).toBeNull()
    expect(screen.queryByText(/50,000/)).toBeNull()
  })

  it("no longer renders the title card, category search box or filter chips", async () => {
    getCategoryTree.mockResolvedValue(deepTree())
    renderWithProviders(<CategoriesExplorer />)
    await screen.findByRole("link", { name: /vehicles/i })

    expect(screen.queryByLabelText("Search categories")).toBeNull()
    expect(screen.queryByText("All Marketplace Categories")).toBeNull()
    expect(screen.queryByText(/All Categories \(/)).toBeNull()
    expect(screen.getByRole("heading", { name: "Browse Categories" })).toBeInTheDocument()
  })

  it("shows an empty state when there are no categories", async () => {
    getCategoryTree.mockResolvedValue([])
    renderWithProviders(<CategoriesExplorer />)
    expect(await screen.findByText("No categories yet")).toBeInTheDocument()
  })

  it("shows an error with retry", async () => {
    getCategoryTree.mockRejectedValueOnce(new Error("boom"))
    getCategoryTree.mockResolvedValue(deepTree())
    renderWithProviders(<CategoriesExplorer />)

    fireEvent.click(await screen.findByRole("button", { name: /try again/i }))
    expect(await screen.findByRole("link", { name: /vehicles/i })).toBeInTheDocument()
  })
})
