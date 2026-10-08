import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import type { CategoryNode } from "@/features/categories/api/categories.api"
import { buildCategoryIndex, getCategoryPath } from "@/features/categories/lib/category-tree"
import { linkTree, node } from "@/features/categories/__tests__/fixtures"
import { CategoryTreeNav } from "../components/category-tree-nav"

/** Vehicles > Cars > (Toyota > Hybrid, Sedan), Honda ; Vehicles > Motorcycles ; Property > Land */
function tree(): CategoryNode[] {
  return linkTree([
    node("vehicles", [
      node("cars", [node("toyota", [node("hybrid"), node("sedan")]), node("honda")]),
      node("motorcycles"),
    ]),
    node("property", [node("land")]),
  ])
}

function renderTree(selectedSlug: string | undefined, onSelect = vi.fn()) {
  const roots = tree()
  const index = buildCategoryIndex(roots)
  const target = selectedSlug ? index.bySlug.get(selectedSlug) : undefined
  const ancestorIds = target ? getCategoryPath(index, target).map((n) => n.id) : []
  const utils = render(
    <CategoryTreeNav
      roots={roots}
      selectedSlug={selectedSlug}
      ancestorIds={ancestorIds}
      onSelect={onSelect}
    />
  )
  const rerenderWith = (slug: string | undefined) => {
    const t = slug ? index.bySlug.get(slug) : undefined
    utils.rerender(
      <CategoryTreeNav
        roots={roots}
        selectedSlug={slug}
        ancestorIds={t ? getCategoryPath(index, t).map((n) => n.id) : []}
        onSelect={onSelect}
      />
    )
  }
  return { ...utils, rerenderWith, onSelect }
}

const has = (name: string) => screen.queryByRole("button", { name }) !== null

describe("<CategoryTreeNav /> keeps the navigation tree intact", () => {
  it("selecting Cars keeps Motorcycles (its sibling) and the other roots visible", () => {
    renderTree("cars")
    expect(has("Vehicles")).toBe(true)
    expect(has("Cars")).toBe(true)
    expect(has("Motorcycles")).toBe(true)
    expect(has("Property")).toBe(true)
  })

  it("highlights the selected category", () => {
    renderTree("cars")
    expect(screen.getByRole("button", { name: "Cars" })).toHaveAttribute("aria-current", "true")
    expect(screen.getByRole("button", { name: "Motorcycles" })).not.toHaveAttribute("aria-current")
  })

  it("selecting a deep subcategory keeps every sibling at every level, with ancestors expanded", () => {
    renderTree("hybrid")
    for (const name of ["Vehicles", "Cars", "Toyota", "Hybrid", "Sedan", "Honda", "Motorcycles", "Property"]) {
      expect(has(name), name).toBe(true)
    }
    expect(screen.getByRole("button", { name: "Hybrid" })).toHaveAttribute("aria-current", "true")
  })

  it("does not expand branches unrelated to the selection", () => {
    renderTree("cars")
    expect(has("Land")).toBe(false)
    expect(has("Hybrid")).toBe(false)
  })

  it("lets the user expand and collapse branches manually", () => {
    renderTree("cars")
    fireEvent.click(screen.getByRole("button", { name: "Expand Property" }))
    expect(has("Land")).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Collapse Property" }))
    expect(has("Land")).toBe(false)

    fireEvent.click(screen.getByRole("button", { name: "Collapse Cars" }))
    expect(has("Toyota")).toBe(false)
    expect(has("Motorcycles")).toBe(true)
  })

  it("keeps manual expansion when another category is selected via the URL, and re-expands ancestors", () => {
    const { rerenderWith } = renderTree("cars")
    fireEvent.click(screen.getByRole("button", { name: "Collapse Vehicles" }))
    expect(has("Cars")).toBe(false)

    rerenderWith("land")
    expect(has("Land")).toBe(true)
    expect(screen.getByRole("button", { name: "Land" })).toHaveAttribute("aria-current", "true")

    rerenderWith("motorcycles")
    expect(has("Motorcycles")).toBe(true)
    expect(has("Cars")).toBe(true)
  })

  it("follows URL changes such as browser back and forward", () => {
    const { rerenderWith } = renderTree("cars")
    rerenderWith("motorcycles")
    expect(screen.getByRole("button", { name: "Motorcycles" })).toHaveAttribute("aria-current", "true")
    expect(screen.getByRole("button", { name: "Cars" })).not.toHaveAttribute("aria-current")
    rerenderWith("cars")
    expect(screen.getByRole("button", { name: "Cars" })).toHaveAttribute("aria-current", "true")
    rerenderWith(undefined)
    expect(screen.getByRole("button", { name: "All Categories" })).toHaveAttribute("aria-current", "true")
  })

  it("reports selection by slug and 'All Categories' as null", () => {
    const { onSelect } = renderTree("cars")
    fireEvent.click(screen.getByRole("button", { name: "Motorcycles" }))
    expect(onSelect).toHaveBeenLastCalledWith("motorcycles")
    fireEvent.click(screen.getByRole("button", { name: "All Categories" }))
    expect(onSelect).toHaveBeenLastCalledWith(null)
  })
})
