import { describe, expect, it, vi, beforeEach } from "vitest"
import { getCategoryFields, getCategoryTree } from "../api/categories.api"
import { selectFilterableFields } from "../api/categories.queries"
import { deepTree } from "./fixtures"

function mockFetch(data: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    json: async () => ({ success: true, data }),
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

describe("categories API contract", () => {
  beforeEach(() => vi.unstubAllGlobals())

  it("GET /categories unwraps the tree and keeps the media key", async () => {
    const tree = deepTree()
    const fetchMock = mockFetch({ categories: tree })

    const result = await getCategoryTree()

    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/categories$/)
    expect(result).toEqual(tree)
    expect(result[0]!.children[0]!.imageR2Key).toBe("categories/cars.png")
  })

  it("GET /categories/:slug/fields unwraps effective field definitions", async () => {
    const fields = [{ assignmentId: "a", field: { name: "brand" } }]
    const fetchMock = mockFetch({ fields })

    expect(await getCategoryFields("cars")).toEqual(fields)
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/categories\/cars\/fields$/)
  })

  it("keeps only filterable fields from the effective definitions", () => {
    const make = (name: string, isFilterable: boolean) => ({
      assignmentId: name,
      categoryId: "c",
      isRequired: false,
      isFilterable,
      displayOrder: 0,
      field: {
        id: name,
        name,
        labelEn: name,
        labelKm: null,
        fieldType: "text" as const,
        options: [],
      },
    })
    const result = selectFilterableFields([make("brand", true), make("make", false)])
    expect(result.map((f) => f.field.name)).toEqual(["brand"])
  })
})
