import type { HomeSection } from "../api/home.api"

export type HomeBlockKey = "banner" | "categories" | "latest"

const SECTION_KEY_TO_BLOCK: Record<string, HomeBlockKey> = {
  hero_slider: "banner",
  categories_grid: "categories",
  recent_listings: "latest",
}

const DEFAULT_ORDER: HomeBlockKey[] = ["categories", "banner", "latest"]

export interface HomeBlock {
  key: HomeBlockKey
  title?: string
  itemCount: number | null
}

/** Backend homepage_configs drive order, visibility and titles. With no config, a default order is used. */
export function resolveHomeBlocks(sections: HomeSection[]): HomeBlock[] {
  const known = sections.filter((s) => SECTION_KEY_TO_BLOCK[s.sectionKey])
  if (sections.length === 0) {
    return DEFAULT_ORDER.map((key) => ({ key, itemCount: null }))
  }
  return [...known]
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({
      key: SECTION_KEY_TO_BLOCK[s.sectionKey]!,
      title: s.title || undefined,
      itemCount: s.itemCount,
    }))
}
