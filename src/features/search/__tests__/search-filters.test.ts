import { describe, expect, it } from "vitest"
import {
  applyLocationChange,
  carryFieldsToCategory,
  clearAllFilters,
  countActiveFilters,
  DEFAULT_SORT,
  parseSearchFilters,
  reconcileLocation,
  sanitizeFieldFilters,
  serializeSearchFilters,
  SORT_LABELS,
  SORT_VALUES,
  type SearchFilters,
} from "../lib/search-filters"
import type { CategoryField } from "@/features/categories/api/categories.api"

const base: SearchFilters = { sort: DEFAULT_SORT, fields: {} }

describe("URL filter parsing and serialization", () => {
  it("round-trips every supported filter", () => {
    const filters: SearchFilters = {
      q: "toyota prius",
      category: "cars",
      provinceId: 1,
      districtId: 102,
      communeId: 10203,
      minPrice: 1000,
      maxPrice: 25000.5,
      currency: "USD",
      sort: "price_asc",
      fields: { transmission: "automatic", year: "2020" },
    }
    const qs = serializeSearchFilters(filters).toString()
    expect(parseSearchFilters(qs)).toEqual(filters)
  })

  it("omits defaults and can omit the route-owned category", () => {
    const qs = serializeSearchFilters({ ...base, category: "cars", q: "x" }, { omitCategory: true })
    expect(qs.toString()).toBe("q=x")
    expect(serializeSearchFilters(base).toString()).toBe("")
  })

  it("serializes dynamic fields with the f. prefix in a stable order", () => {
    const qs = serializeSearchFilters({ ...base, fields: { year: "2020", brand: "toyota" } })
    expect(qs.toString()).toBe("f.brand=toyota&f.year=2020")
  })

  it("ignores malformed values instead of throwing", () => {
    const parsed = parseSearchFilters(
      "province=abc&district=-3&commune=1.5&minPrice=-5&maxPrice=NaN&currency=EUR&sort=bogus&category=a b!&f.bad name=x&f.ok="
    )
    expect(parsed).toEqual({ sort: DEFAULT_SORT, fields: {} })
  })

  it("normalizes currency case and trims keyword text", () => {
    const parsed = parseSearchFilters("currency=khr&q=%20%20phone%20")
    expect(parsed.currency).toBe("KHR")
    expect(parsed.q).toBe("phone")
  })

  it("accepts URLSearchParams-like input", () => {
    expect(parseSearchFilters(new URLSearchParams("sort=oldest")).sort).toBe("oldest")
  })
})

describe("sort values", () => {
  it("only exposes backend-supported values with separate presentation labels", () => {
    expect([...SORT_VALUES]).toEqual([
      "newest",
      "oldest",
      "price_asc",
      "price_desc",
      "recently_updated",
    ])
    expect(SORT_LABELS.price_asc).toBe("Price: Low to High")
    for (const value of SORT_VALUES) expect(SORT_LABELS[value]).not.toBe(value)
  })

  it("falls back to the default for unsupported sorts such as the removed 'recommended'", () => {
    expect(parseSearchFilters("sort=recommended").sort).toBe(DEFAULT_SORT)
  })
})

describe("province -> district -> commune cascade", () => {
  const located: SearchFilters = { ...base, provinceId: 1, districtId: 10, communeId: 100 }

  it("changing province clears district and commune", () => {
    expect(applyLocationChange(located, { provinceId: 2 })).toMatchObject({
      provinceId: 2,
      districtId: undefined,
      communeId: undefined,
    })
  })

  it("clearing province clears everything below it", () => {
    const next = applyLocationChange(located, { provinceId: null })
    expect([next.provinceId, next.districtId, next.communeId]).toEqual([
      undefined,
      undefined,
      undefined,
    ])
  })

  it("changing district clears commune but keeps province", () => {
    expect(applyLocationChange(located, { districtId: 11 })).toMatchObject({
      provinceId: 1,
      districtId: 11,
      communeId: undefined,
    })
  })

  it("selecting the same province keeps its children", () => {
    expect(applyLocationChange(located, { provinceId: 1 })).toEqual(located)
  })

  it("lets one patch set the whole chain", () => {
    expect(
      applyLocationChange(base, { provinceId: 3, districtId: 30, communeId: 300 })
    ).toMatchObject({ provinceId: 3, districtId: 30, communeId: 300 })
  })

  it("drops a district or commune that is not in the loaded parent list", () => {
    expect(reconcileLocation(located, { districtIds: [11, 12] })).toMatchObject({
      provinceId: 1,
      districtId: undefined,
      communeId: undefined,
    })
    expect(reconcileLocation(located, { districtIds: [10], communeIds: [999] })).toMatchObject({
      districtId: 10,
      communeId: undefined,
    })
  })

  it("drops orphaned children and returns the same object when nothing changes", () => {
    expect(reconcileLocation({ ...base, districtId: 5 }, {})).toMatchObject({
      districtId: undefined,
    })
    expect(reconcileLocation({ ...base, communeId: 5 }, {})).toMatchObject({ communeId: undefined })
    expect(reconcileLocation(located, { districtIds: [10], communeIds: [100] })).toBe(located)
  })
})

describe("dynamic field filters", () => {
  const def = (
    name: string,
    fieldType: CategoryField["field"]["fieldType"],
    options: string[] = []
  ): CategoryField => ({
    assignmentId: name,
    categoryId: "c",
    isRequired: false,
    isFilterable: true,
    displayOrder: 0,
    field: {
      id: name,
      name,
      labelEn: name,
      labelKm: null,
      fieldType,
      options: options.map((value) => ({
        id: value,
        fieldDefinitionId: name,
        value,
        labelEn: value,
        labelKm: null,
        displayOrder: 0,
      })),
    },
  })

  const definitions = [
    def("transmission", "select", ["automatic", "manual"]),
    def("year", "number"),
    def("hybrid", "boolean"),
    def("brand", "text"),
  ]

  it("keeps values valid for their backend field type", () => {
    expect(
      sanitizeFieldFilters(
        { transmission: "manual", year: "2020", hybrid: "true", brand: "toyota" },
        definitions
      )
    ).toEqual({ transmission: "manual", year: "2020", hybrid: "true", brand: "toyota" })
  })

  it("drops unknown fields and invalid values so the API never receives a 400", () => {
    expect(
      sanitizeFieldFilters(
        { transmission: "cvt", year: "abc", hybrid: "maybe", ghost: "1" },
        definitions
      )
    ).toEqual({})
  })

  it("carries only dynamic fields that stay effective in the target category", () => {
    const motorcycleDefs = [def("year", "number"), def("engine_cc", "number")]
    expect(
      carryFieldsToCategory({ year: "2020", transmission: "manual", brand: "toyota" }, motorcycleDefs)
    ).toEqual({ year: "2020" })
    expect(carryFieldsToCategory({ year: "2020" }, [])).toEqual({})
  })
})

describe("clear all (shared by Reset and Clear all)", () => {
  const dirty: SearchFilters = {
    q: "yamaha",
    category: "cars",
    provinceId: 1,
    districtId: 10,
    communeId: 100,
    minPrice: 5,
    maxPrice: 50,
    currency: "USD",
    sort: "price_desc",
    fields: { year: "2020" },
  }

  it("on /search it clears everything, including keyword, category and sort", () => {
    expect(clearAllFilters(dirty, { preserveCategory: false })).toEqual({
      category: undefined,
      sort: DEFAULT_SORT,
      fields: {},
    })
    expect(serializeSearchFilters(clearAllFilters(dirty, { preserveCategory: false })).toString()).toBe("")
  })

  it("on a category route it clears filters but keeps the route's category", () => {
    const next = clearAllFilters(dirty, { preserveCategory: true })
    expect(next).toEqual({ category: "cars", sort: DEFAULT_SORT, fields: {} })
    expect(serializeSearchFilters(next, { omitCategory: true }).toString()).toBe("")
  })
})

describe("active filter count (one definition for sidebar, drawer and chips)", () => {
  const def = (name: string): CategoryField => ({
    assignmentId: name,
    categoryId: "c",
    isRequired: false,
    isFilterable: true,
    displayOrder: 0,
    field: { id: name, name, labelEn: name, labelKm: null, fieldType: "number", options: [] },
  })

  it("counts one per removable chip: keyword, category, each location level, price, each known field", () => {
    const filters: SearchFilters = {
      ...base,
      q: "x",
      category: "cars",
      provinceId: 1,
      districtId: 2,
      communeId: 3,
      minPrice: 1,
      maxPrice: 2,
      fields: { year: "2020", ghost: "1" },
    }
    expect(countActiveFilters(filters, { includeCategory: true, definitions: [def("year")] })).toBe(7)
  })

  it("excludes the category on a category route and counts price or currency alone once", () => {
    expect(countActiveFilters({ ...base, category: "cars" })).toBe(0)
    expect(countActiveFilters({ ...base, category: "cars" }, { includeCategory: true })).toBe(1)
    expect(countActiveFilters({ ...base, currency: "KHR" })).toBe(1)
    expect(countActiveFilters({ ...base, minPrice: 1, currency: "KHR" })).toBe(1)
  })

  it("ignores dynamic fields entirely when there is no category", () => {
    expect(countActiveFilters({ ...base, fields: { year: "2020" } })).toBe(0)
  })
})
