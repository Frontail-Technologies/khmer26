import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { DEFAULT_SORT, type SearchFilters } from "../lib/search-filters"

vi.mock("@/features/locations/api/locations.api", () => ({
  getProvinces: vi.fn().mockResolvedValue([
    { id: 1, nameEn: "Phnom Penh", nameKm: null },
    { id: 2, nameEn: "Kandal", nameKm: null },
  ]),
  getDistricts: vi.fn().mockResolvedValue([{ id: 10, nameEn: "Chamkar Mon", nameKm: null }]),
  getCommunes: vi.fn().mockResolvedValue([{ id: 100, nameEn: "Tonle Bassac", nameKm: null }]),
}))

import { FilterPanel } from "../components/filter-panel"

const field = (
  name: string,
  labelEn: string,
  fieldType: CategoryField["field"]["fieldType"],
  options: Array<[string, string]> = []
): CategoryField => ({
  assignmentId: name,
  categoryId: "c",
  isRequired: false,
  isFilterable: true,
  displayOrder: 0,
  field: {
    id: name,
    name,
    labelEn,
    labelKm: null,
    fieldType,
    options: options.map(([value, label], i) => ({
      id: `${name}-${i}`,
      fieldDefinitionId: name,
      value,
      labelEn: label,
      labelKm: null,
      displayOrder: i,
    })),
  },
})

const definitions = [
  field("transmission", "Transmission", "select", [
    ["automatic", "Automatic"],
    ["manual", "Manual"],
  ]),
  field("year", "Year", "number"),
  field("is_hybrid", "Hybrid", "boolean"),
  field("brand", "Brand", "text"),
]

const base: SearchFilters = { sort: DEFAULT_SORT, fields: {} }

describe("<FilterPanel /> dynamic category filters", () => {
  beforeEach(() => vi.clearAllMocks())

  it("generates one control per backend definition, by field type", () => {
    renderWithProviders(
      <FilterPanel filters={{ ...base, category: "cars" }} onChange={vi.fn()} definitions={definitions} />
    )

    expect(screen.getByText("Transmission")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Automatic" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Manual" })).toBeInTheDocument()
    expect(screen.getByLabelText("Year")).toHaveAttribute("type", "number")
    expect(screen.getByLabelText("Brand")).toHaveAttribute("type", "text")
    expect(screen.getByText("Hybrid")).toBeInTheDocument()
  })

  it("renders nothing category-specific when no definitions exist", () => {
    renderWithProviders(<FilterPanel filters={base} onChange={vi.fn()} definitions={[]} />)
    expect(screen.queryByText("Transmission")).toBeNull()
    expect(screen.queryByText(/brand/i)).toBeNull()
    expect(screen.queryByText(/fuel|year|condition/i)).toBeNull()
  })

  it("writes a select choice into filters.fields and toggles it off again", () => {
    const onChange = vi.fn()
    const { rerender } = renderWithProviders(
      <FilterPanel filters={{ ...base, category: "cars" }} onChange={onChange} definitions={definitions} />
    )

    fireEvent.click(screen.getByRole("button", { name: "Manual" }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ fields: { transmission: "manual" } })
    )

    rerender(
      <FilterPanel
        filters={{ ...base, category: "cars", fields: { transmission: "manual" } }}
        onChange={onChange}
        definitions={definitions}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Manual" }))
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ fields: {} }))
  })

  it("commits number and text inputs on Enter", () => {
    const onChange = vi.fn()
    renderWithProviders(
      <FilterPanel filters={{ ...base, category: "cars" }} onChange={onChange} definitions={definitions} />
    )

    const year = screen.getByLabelText("Year")
    fireEvent.change(year, { target: { value: "2020" } })
    fireEvent.keyDown(year, { key: "Enter" })
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ fields: { year: "2020" } }))
  })
})

describe("<FilterPanel /> location cascade", () => {
  it("lists provinces from the backend and resets the chain when the province changes", async () => {
    const onChange = vi.fn()
    renderWithProviders(
      <FilterPanel
        filters={{ ...base, provinceId: 1, districtId: 10, communeId: 100 }}
        onChange={onChange}
      />
    )

    fireEvent.click(await screen.findByRole("button", { name: "Other provinces" }))
    fireEvent.click(await screen.findByRole("button", { name: "Kandal" }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ provinceId: 2, districtId: undefined, communeId: undefined })
    )
  })

  it("collapses the long province list to the selected province and its districts", async () => {
    renderWithProviders(<FilterPanel filters={{ ...base, provinceId: 1 }} onChange={vi.fn()} />)

    expect(await screen.findByRole("button", { name: "Phnom Penh" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(await screen.findByRole("button", { name: "Chamkar Mon" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Kandal" })).toBeNull()
  })

  it("clicking the selected province clears it and brings back the full list", async () => {
    const onChange = vi.fn()
    renderWithProviders(<FilterPanel filters={{ ...base, provinceId: 1, districtId: 10 }} onChange={onChange} />)

    fireEvent.click(await screen.findByRole("button", { name: "Phnom Penh" }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ provinceId: undefined, districtId: undefined, communeId: undefined })
    )
  })

  it("shows districts only after a province and communes only after a district", async () => {
    const { rerender } = renderWithProviders(<FilterPanel filters={base} onChange={vi.fn()} />)
    await screen.findByRole("button", { name: "Phnom Penh" })
    expect(screen.queryByText("District")).toBeNull()

    rerender(<FilterPanel filters={{ ...base, provinceId: 1 }} onChange={vi.fn()} />)
    expect(await screen.findByRole("button", { name: "Chamkar Mon" })).toBeInTheDocument()
    expect(screen.queryByText("Commune")).toBeNull()

    rerender(<FilterPanel filters={{ ...base, provinceId: 1, districtId: 10 }} onChange={vi.fn()} />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Tonle Bassac" })).toBeInTheDocument()
    )
  })
})
