import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "@/test/test-utils"
import type { AdminCategoryItem } from "../types"
import { CreateCategoryDialog } from "./create-category-dialog"

vi.mock("../hooks/categories.mutations", () => ({
  useCreateCategory: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock("./category-image-uploader", () => ({ CategoryImageUploader: () => null }))

const category = (id: string, name: string): AdminCategoryItem => ({
  id,
  name,
  slug: name.toLowerCase(),
  description: "",
  listingCount: 0,
  isActive: true,
  sortOrder: 0,
  subcategories: [],
})

const selectedLabels = () => screen.getAllByRole("combobox").map((el) => el.textContent?.replace("▼", "").trim())

const parents = [category("cars", "Vehicles"), category("homes", "Property")]

describe("<CreateCategoryDialog />", () => {
  it("preselects the parent each time it is opened for a subcategory", () => {
    const { rerender } = renderWithProviders(
      <CreateCategoryDialog open={false} onOpenChange={vi.fn()} parentCategories={parents} defaultParentId="cars" />
    )

    rerender(<CreateCategoryDialog open onOpenChange={vi.fn()} parentCategories={parents} defaultParentId="homes" />)

    expect(screen.getByText("Add Subcategory")).toBeInTheDocument()
    expect(selectedLabels()).toContain("Property")

    rerender(<CreateCategoryDialog open={false} onOpenChange={vi.fn()} parentCategories={parents} defaultParentId="homes" />)
    rerender(<CreateCategoryDialog open onOpenChange={vi.fn()} parentCategories={parents} defaultParentId="cars" />)

    expect(selectedLabels()).toContain("Vehicles")
  })
})
