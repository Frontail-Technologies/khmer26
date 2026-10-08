import { describe, expect, it } from "vitest"
import {
  buildCategoryIndex,
  countDescendants,
  filterCategoryTree,
  findCategorySuggestions,
  getBreadcrumbs,
  getCategoryHref,
  getCategoryPath,
  resolveCategoryFromSegments,
} from "../lib/category-tree"
import { deepTree, linkTree, node } from "./fixtures"

describe("category tree (arbitrary depth)", () => {
  const index = buildCategoryIndex(deepTree())

  it("indexes every level by slug and keeps the roots", () => {
    expect([...index.bySlug.keys()].sort()).toEqual([
      "cars",
      "hybrid",
      "land",
      "motorcycles",
      "property",
      "toyota",
      "vehicles",
    ])
    expect(index.roots.map((r) => r.slug)).toEqual(["vehicles", "property"])
  })

  it("builds the ancestor path for a 4-level category", () => {
    const path = getCategoryPath(index, index.bySlug.get("hybrid")!)
    expect(path.map((n) => n.slug)).toEqual(["vehicles", "cars", "toyota", "hybrid"])
    expect(getCategoryHref(path)).toBe("/category/vehicles/cars/toyota/hybrid")
  })

  it("has no fixed maximum depth", () => {
    let current = node("level-12")
    for (let depth = 11; depth >= 1; depth--) current = node(`level-${depth}`, [current])
    const deepIndex = buildCategoryIndex(linkTree([current]))
    const path = getCategoryPath(deepIndex, deepIndex.bySlug.get("level-12")!)
    expect(path).toHaveLength(12)
  })

  it("builds breadcrumbs for a deep category with links on every ancestor", () => {
    const path = getCategoryPath(index, index.bySlug.get("toyota")!)
    expect(getBreadcrumbs(path)).toEqual([
      { label: "Home", href: "/" },
      { label: "Categories", href: "/categories" },
      { label: "Vehicles", href: "/category/vehicles" },
      { label: "Cars", href: "/category/vehicles/cars" },
      { label: "Toyota", href: undefined },
    ])
  })

  it("resolves a canonical deep link", () => {
    const resolved = resolveCategoryFromSegments(index, ["vehicles", "cars", "toyota"])
    expect(resolved?.node.slug).toBe("toyota")
    expect(resolved?.isCanonical).toBe(true)
    expect(resolved?.canonicalHref).toBe("/category/vehicles/cars/toyota")
  })

  it("resolves by the last segment and flags non-canonical paths for redirect", () => {
    const single = resolveCategoryFromSegments(index, ["toyota"])
    expect(single?.node.slug).toBe("toyota")
    expect(single?.isCanonical).toBe(false)
    expect(single?.canonicalHref).toBe("/category/vehicles/cars/toyota")

    const wrongAncestry = resolveCategoryFromSegments(index, ["property", "toyota"])
    expect(wrongAncestry?.node.slug).toBe("toyota")
    expect(wrongAncestry?.isCanonical).toBe(false)
  })

  it("returns null for unknown or empty segments", () => {
    expect(resolveCategoryFromSegments(index, ["nope"])).toBeNull()
    expect(resolveCategoryFromSegments(index, [])).toBeNull()
  })

  it("does not throw on malformed percent-encoding", () => {
    expect(resolveCategoryFromSegments(index, ["%E0%A4%A"])).toBeNull()
  })

  it("decodes encoded segments", () => {
    expect(resolveCategoryFromSegments(index, ["vehicles", "%63ars"])?.node.slug).toBe("cars")
  })

  it("counts descendants and filters the tree by any nested name", () => {
    expect(countDescendants(index.bySlug.get("vehicles")!)).toBe(4)
    expect(filterCategoryTree(index.roots, "hybrid").map((n) => n.slug)).toEqual(["vehicles"])
    expect(filterCategoryTree(index.roots, "LAND").map((n) => n.slug)).toEqual(["property"])
    expect(filterCategoryTree(index.roots, "zzz")).toEqual([])
    expect(filterCategoryTree(index.roots, "  ")).toBe(index.roots)
  })

  it("suggests real categories at any depth, prefix matches first, with their ancestry", () => {
    const tree = buildCategoryIndex(linkTree([
      node("vehicles", [node("cars", [node("toyota", [node("hybrid")])]), node("motorcycles")]),
      node("yamaha-parts"),
    ]))
    const suggestions = findCategorySuggestions(tree, "ya", 5)
    expect(suggestions.map((s) => s.node.slug)).toEqual(["yamaha-parts"])

    const hybrid = findCategorySuggestions(tree, "hyb", 5)
    expect(hybrid[0]!.path.map((n) => n.slug)).toEqual(["vehicles", "cars", "toyota", "hybrid"])

    expect(findCategorySuggestions(tree, "o", 2)).toHaveLength(2)
    expect(findCategorySuggestions(tree, "  ", 5)).toEqual([])
    expect(findCategorySuggestions(tree, "zzz", 5)).toEqual([])
  })
})
