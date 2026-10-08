import type { CategoryNode } from "../api/categories.api"

export interface CategoryIndex {
  roots: CategoryNode[]
  byId: Map<string, CategoryNode>
  bySlug: Map<string, CategoryNode>
}

export interface ResolvedCategory {
  node: CategoryNode
  path: CategoryNode[]
  canonicalHref: string
  isCanonical: boolean
}

export function buildCategoryIndex(tree: CategoryNode[]): CategoryIndex {
  const byId = new Map<string, CategoryNode>()
  const bySlug = new Map<string, CategoryNode>()
  const visit = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      byId.set(node.id, node)
      bySlug.set(node.slug, node)
      visit(node.children)
    }
  }
  visit(tree)
  return { roots: tree, byId, bySlug }
}

/** Ancestors first, current node last. Works for any depth. */
export function getCategoryPath(index: CategoryIndex, node: CategoryNode): CategoryNode[] {
  const path: CategoryNode[] = []
  const seen = new Set<string>()
  let current: CategoryNode | undefined = node
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    path.unshift(current)
    current = current.parentId ? index.byId.get(current.parentId) : undefined
  }
  return path
}

export function getCategoryHref(path: CategoryNode[]): string {
  return `/category/${path.map((n) => encodeURIComponent(n.slug)).join("/")}`
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

/**
 * Resolves a /category/... URL. The last segment is the unique category slug; the leading
 * segments are only the canonical ancestry, so partial or outdated paths still resolve.
 */
export function resolveCategoryFromSegments(
  index: CategoryIndex,
  segments: string[]
): ResolvedCategory | null {
  const decoded = segments.map(safeDecode).filter(Boolean)
  const last = decoded[decoded.length - 1]
  if (!last) return null
  const node = index.bySlug.get(last)
  if (!node) return null

  const path = getCategoryPath(index, node)
  const canonicalSlugs = path.map((n) => n.slug)
  const isCanonical =
    canonicalSlugs.length === decoded.length &&
    canonicalSlugs.every((slug, i) => slug === decoded[i])

  return { node, path, canonicalHref: getCategoryHref(path), isCanonical }
}

export function getBreadcrumbs(path: CategoryNode[]): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
  ]
  path.forEach((node, i) => {
    const isLast = i === path.length - 1
    crumbs.push({
      label: node.nameEn,
      href: isLast ? undefined : getCategoryHref(path.slice(0, i + 1)),
    })
  })
  return crumbs
}

export function countDescendants(node: CategoryNode): number {
  return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0)
}

/** Keeps nodes whose own name matches, or that have a matching descendant. */
export function filterCategoryTree(tree: CategoryNode[], query: string): CategoryNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return tree
  const matches = (node: CategoryNode): boolean =>
    node.nameEn.toLowerCase().includes(q) || node.children.some(matches)
  return tree.filter(matches)
}

export interface CategorySuggestion {
  node: CategoryNode
  path: CategoryNode[]
}

/** Real categories (any depth) whose name matches; prefix matches first. */
export function findCategorySuggestions(
  index: CategoryIndex,
  query: string,
  limit: number
): CategorySuggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const matches = [...index.byId.values()].filter((n) => n.nameEn.toLowerCase().includes(q))
  matches.sort((a, b) => {
    const aPrefix = a.nameEn.toLowerCase().startsWith(q) ? 0 : 1
    const bPrefix = b.nameEn.toLowerCase().startsWith(q) ? 0 : 1
    return aPrefix - bPrefix
  })
  return matches.slice(0, limit).map((node) => ({ node, path: getCategoryPath(index, node) }))
}
