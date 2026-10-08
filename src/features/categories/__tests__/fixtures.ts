import type { CategoryNode } from "../api/categories.api"

export function node(
  slug: string,
  children: CategoryNode[] = [],
  overrides: Partial<CategoryNode> = {}
): CategoryNode {
  return {
    id: `id-${slug}`,
    parentId: null,
    nameEn: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    nameKm: null,
    slug,
    imageR2Key: null,
    displayOrder: 0,
    children,
    ...overrides,
  }
}

function linkParents(n: CategoryNode, parentId: string | null): CategoryNode {
  return { ...n, parentId, children: n.children.map((c) => linkParents(c, n.id)) }
}

export function linkTree(roots: CategoryNode[]): CategoryNode[] {
  return roots.map((r) => linkParents(r, null))
}

/** Vehicles -> Cars -> Toyota -> Hybrid (4 levels), plus Property -> Land. */
export function deepTree(): CategoryNode[] {
  const hybrid = node("hybrid")
  const toyota = node("toyota", [hybrid])
  const cars = node("cars", [toyota], { imageR2Key: "categories/cars.png" })
  const vehicles = node("vehicles", [cars, node("motorcycles")])
  const property = node("property", [node("land")])
  return linkTree([vehicles, property])
}
