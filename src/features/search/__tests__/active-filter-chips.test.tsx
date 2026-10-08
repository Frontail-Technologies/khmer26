import { describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { DEFAULT_SORT, type SearchFilters } from "../lib/search-filters"

vi.mock("@/features/locations/api/locations.api", () => ({
  getProvinces: vi.fn().mockResolvedValue([{ id: 1, nameEn: "Phnom Penh", nameKm: null }]),
  getDistricts: vi.fn().mockResolvedValue([{ id: 10, nameEn: "Chamkar Mon", nameKm: null }]),
  getCommunes: vi.fn().mockResolvedValue([]),
}))

import { ActiveFilterChips } from "../components/active-filter-chips"

const transmission: CategoryField = {
  assignmentId: "t",
  categoryId: "c",
  isRequired: false,
  isFilterable: true,
  displayOrder: 0,
  field: {
    id: "t",
    name: "transmission",
    labelEn: "Transmission",
    labelKm: null,
    fieldType: "select",
    options: [
      {
        id: "o1",
        fieldDefinitionId: "t",
        value: "automatic",
        labelEn: "Automatic",
        labelKm: null,
        displayOrder: 0,
      },
    ],
  },
}

const filters: SearchFilters = {
  q: "prius",
  category: "cars",
  provinceId: 1,
  districtId: 10,
  minPrice: 1000,
  maxPrice: 5000,
  currency: "USD",
  sort: DEFAULT_SORT,
  fields: { transmission: "automatic", stale_field: "x" },
}

describe("<ActiveFilterChips />", () => {
  it("shows a chip per active filter using backend names and labels, hiding stale fields", async () => {
    renderWithProviders(
      <ActiveFilterChips
        filters={filters}
        onChange={vi.fn()}
        onClearAll={vi.fn()}
        definitions={[transmission]}
        categoryChipLabel="Cars"
      />
    )

    expect(screen.getByText("Keyword: prius")).toBeInTheDocument()
    expect(screen.getByText("Category: Cars")).toBeInTheDocument()
    expect(await screen.findByText("Phnom Penh")).toBeInTheDocument()
    expect(await screen.findByText("Chamkar Mon")).toBeInTheDocument()
    expect(screen.getByText("1,000 – 5,000 USD")).toBeInTheDocument()
    expect(screen.getByText("Transmission: Automatic")).toBeInTheDocument()
    expect(screen.queryByText(/stale_field/)).toBeNull()
  })

  it("each chip clears only its own filter", () => {
    const onChange = vi.fn()
    renderWithProviders(
      <ActiveFilterChips
        filters={filters}
        onChange={onChange}
        onClearAll={vi.fn()}
        definitions={[transmission]}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Remove filter Keyword: prius" }))
    expect(onChange).toHaveBeenLastCalledWith({ ...filters, q: undefined })

    fireEvent.click(screen.getByRole("button", { name: "Remove filter 1,000 – 5,000 USD" }))
    expect(onChange).toHaveBeenLastCalledWith({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      currency: undefined,
    })

    fireEvent.click(screen.getByRole("button", { name: "Remove filter Transmission: Automatic" }))
    expect(onChange).toHaveBeenLastCalledWith({
      ...filters,
      fields: { stale_field: "x" },
    })
  })

  it("removing the category on /search also clears its category-specific dynamic filters", () => {
    const onChange = vi.fn()
    renderWithProviders(
      <ActiveFilterChips
        filters={filters}
        onChange={onChange}
        onClearAll={vi.fn()}
        definitions={[transmission]}
        categoryChipLabel="Cars"
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Remove filter Category: Cars" }))
    expect(onChange).toHaveBeenLastCalledWith({ ...filters, category: undefined, fields: {} })
  })

  it("removing the district clears its commune but keeps the province", () => {
    const onChange = vi.fn()
    renderWithProviders(
      <ActiveFilterChips
        filters={{ ...filters, communeId: 100 }}
        onChange={onChange}
        onClearAll={vi.fn()}
        definitions={[]}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /Remove filter (District|Chamkar Mon)/ }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ provinceId: 1, districtId: undefined, communeId: undefined })
    )
  })

  it("removing the province also clears its district and commune", () => {
    const onChange = vi.fn()
    renderWithProviders(
      <ActiveFilterChips filters={filters} onChange={onChange} onClearAll={vi.fn()} definitions={[]} />
    )

    fireEvent.click(screen.getByRole("button", { name: /Remove filter (Province|Phnom Penh)/ }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ provinceId: undefined, districtId: undefined })
    )
  })

  it("does not show a category chip on a category page", () => {
    renderWithProviders(
      <ActiveFilterChips filters={filters} onChange={vi.fn()} onClearAll={vi.fn()} definitions={[]} />
    )
    expect(screen.queryByText(/Category:/)).toBeNull()
  })

  it("Clear all delegates to onClearAll and renders nothing without filters", () => {
    const onClearAll = vi.fn()
    const { container, rerender } = renderWithProviders(
      <ActiveFilterChips filters={filters} onChange={vi.fn()} onClearAll={onClearAll} definitions={[]} />
    )
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }))
    expect(onClearAll).toHaveBeenCalledTimes(1)

    rerender(
      <ActiveFilterChips
        filters={{ sort: DEFAULT_SORT, fields: {} }}
        onChange={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
