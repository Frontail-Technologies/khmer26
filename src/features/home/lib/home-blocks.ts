import type { HomeFeaturedSection, HomeSection } from "../api/home.api"

export type HomeBlockKey = "banner" | "categories" | "latest" | "cta" | `featured:${string}`

const SECTION_KEY_TO_BLOCK: Record<string, HomeBlockKey> = {
  hero_slider: "banner",
  categories_grid: "categories",
  recent_listings: "latest",
  trust_banner: "cta",
}

const DEFAULT_ORDER: HomeBlockKey[] = ["categories", "banner", "latest"]

export interface HomeBlock {
  key: HomeBlockKey
  title?: string
  titleKm?: string | null
  itemCount: number | null
  featuredSection?: HomeFeaturedSection
}

/** Backend homepage_configs drive order, visibility and titles. With no config, a default order is used. */
export function resolveHomeBlocks(
  sections: HomeSection[],
  featuredSections: HomeFeaturedSection[] = []
): HomeBlock[] {
  const known = sections.filter((s) => SECTION_KEY_TO_BLOCK[s.sectionKey])
  const featured = featuredSections
    .filter((section) => section.slug !== "homepage-popular-categories" && section.isActive)
    .map((section) => ({
      key: `featured:${section.id}` as const,
      title: section.title,
      titleKm: section.titleKm,
      itemCount: section.itemLimit,
      sortOrder: section.sortOrder,
      featuredSection: section,
    }))

  if (sections.length === 0 && featured.length === 0) {
    return DEFAULT_ORDER.map((key) => ({ key, itemCount: null }))
  }
  const builtins = [...known]
    .filter((section) => section.isEnabled)
    .map((section) => ({
      ...section,
      key: SECTION_KEY_TO_BLOCK[section.sectionKey]!,
    }))

  return [...builtins, ...featured]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({
      key: s.key,
      title: s.title || undefined,
      titleKm: s.titleKm,
      itemCount: s.itemCount,
      featuredSection: "featuredSection" in s ? s.featuredSection : undefined,
    }))
}
