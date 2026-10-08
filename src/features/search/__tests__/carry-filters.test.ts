import { describe, expect, it, vi } from "vitest"
import { QueryClient } from "@tanstack/react-query"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { DEFAULT_SORT, type SearchFilters } from "../lib/search-filters"

const getCategoryFields = vi.fn()
vi.mock("@/features/categories/api/categories.api", async (orig) => ({
  ...(await orig<typeof import("@/features/categories/api/categories.api")>()),
  getCategoryFields: (slug: string) => getCategoryFields(slug),
}))

import { carryFiltersToCategory } from "../lib/carry-filters"

const numberField = (name: string, isFilterable = true): CategoryField => ({
  assignmentId: name,
  categoryId: "c",
  isRequired: false,
  isFilterable,
  displayOrder: 0,
  field: { id: name, name, labelEn: name, labelKm: null, fieldType: "number", options: [] },
})

const filters: SearchFilters = {
  q: "bike",
  category: "cars",
  provinceId: 1,
  sort: DEFAULT_SORT,
  fields: { engine_size: "2000", year: "2020" },
}

describe("carryFiltersToCategory (category switch)", () => {
  it("removes dynamic filters that are not effective for the new category and keeps shared ones", async () => {
    getCategoryFields.mockResolvedValue([numberField("year"), numberField("mileage_km")])
    const result = await carryFiltersToCategory(new QueryClient(), filters, "motorcycles")

    expect(getCategoryFields).toHaveBeenCalledWith("motorcycles")
    expect(result).toEqual({ ...filters, category: "motorcycles", fields: { year: "2020" } })
  })

  it("does not carry fields the new category exposes but does not allow filtering on", async () => {
    getCategoryFields.mockResolvedValue([numberField("year", false)])
    const result = await carryFiltersToCategory(new QueryClient(), filters, "motorcycles")
    expect(result.fields).toEqual({})
  })

  it("drops all dynamic filters if the new category's definitions cannot be loaded", async () => {
    getCategoryFields.mockRejectedValue(new Error("network"))
    const result = await carryFiltersToCategory(new QueryClient(), filters, "motorcycles")
    expect(result).toMatchObject({ category: "motorcycles", fields: {}, q: "bike", provinceId: 1 })
  })

  it("skips the definitions request when there is nothing to carry", async () => {
    getCategoryFields.mockClear()
    const result = await carryFiltersToCategory(
      new QueryClient(),
      { ...filters, fields: {} },
      "motorcycles"
    )
    expect(getCategoryFields).not.toHaveBeenCalled()
    expect(result.category).toBe("motorcycles")
  })
})
