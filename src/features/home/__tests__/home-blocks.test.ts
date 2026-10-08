import { describe, expect, it } from "vitest"
import { resolveHomeBlocks } from "../lib/home-blocks"
import type { HomeSection } from "../api/home.api"

const section = (o: Partial<HomeSection>): HomeSection => ({
  id: o.sectionKey ?? "x",
  sectionKey: "recent_listings",
  title: "T",
  subtitle: null,
  isEnabled: true,
  sortOrder: 0,
  itemCount: null,
  ...o,
})

describe("resolveHomeBlocks", () => {
  it("orders blocks by backend sortOrder", () => {
    const blocks = resolveHomeBlocks([
      section({ sectionKey: "recent_listings", sortOrder: 3 }),
      section({ sectionKey: "hero_slider", sortOrder: 1 }),
      section({ sectionKey: "categories_grid", sortOrder: 2 }),
    ])
    expect(blocks.map((b) => b.key)).toEqual(["banner", "categories", "latest"])
  })

  it("drops disabled sections and sections the homepage has no UI for", () => {
    const blocks = resolveHomeBlocks([
      section({ sectionKey: "hero_slider", sortOrder: 1, isEnabled: false }),
      section({ sectionKey: "featured_listings", sortOrder: 2 }),
      section({ sectionKey: "recent_listings", sortOrder: 3, title: "Fresh", itemCount: 4 }),
    ])
    expect(blocks).toEqual([{ key: "latest", title: "Fresh", itemCount: 4 }])
  })

  it("uses a default order only when the backend returns no section config", () => {
    expect(resolveHomeBlocks([]).map((b) => b.key)).toEqual(["categories", "banner", "latest"])
  })
})
