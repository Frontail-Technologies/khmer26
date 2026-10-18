import { describe, expect, it } from "vitest"
import type { ContentPage, ContentPageSection } from "../types"
import { localizePage, localizeSections, localizeTip, pickText } from "./localize"

const section = (id: string, title: string): ContentPageSection => ({ id, title, paragraphs: [`${title} text`], items: [] })

const page: ContentPage = {
  id: "1",
  slug: "terms",
  eyebrow: "Legal",
  title: "Terms",
  summary: "Our terms",
  sections: [section("a", "First"), section("b", "Second")],
  eyebrowKm: "ច្បាប់",
  titleKm: "លក្ខខណ្ឌ",
  summaryKm: null,
  sectionsKm: [section("b", "ទីពីរ")],
  isPublished: true,
  publishedAt: null,
  createdAt: "",
  updatedAt: "",
}

describe("pickText", () => {
  it("uses Khmer only for the Khmer locale and when it is filled in", () => {
    expect(pickText("Hello", "សួស្តី", "km")).toBe("សួស្តី")
    expect(pickText("Hello", "សួស្តី", "en")).toBe("Hello")
    expect(pickText("Hello", "", "km")).toBe("Hello")
    expect(pickText("Hello", "   ", "km")).toBe("Hello")
    expect(pickText("Hello", null, "km")).toBe("Hello")
    expect(pickText("Hello", undefined, "km")).toBe("Hello")
  })
})

describe("localizeTip", () => {
  it("falls back to English when there is no Khmer tip", () => {
    expect(localizeTip({ tip: "Meet in public", tipKm: null }, "km")).toBe("Meet in public")
    expect(localizeTip({ tip: "Meet in public", tipKm: "ជួបនៅទីសាធារណៈ" }, "km")).toBe("ជួបនៅទីសាធារណៈ")
  })
})

describe("localizeSections", () => {
  it("matches Khmer sections by id and keeps English for untranslated ones", () => {
    const result = localizeSections(page.sections, page.sectionsKm, "km")
    expect(result.map((item) => item.title)).toEqual(["First", "ទីពីរ"])
  })

  it("keeps the English order when the sections are reordered", () => {
    const reordered = [...page.sections].reverse()
    expect(localizeSections(reordered, page.sectionsKm, "km").map((item) => item.title)).toEqual(["ទីពីរ", "First"])
  })

  it("returns English untouched for the English locale or without translations", () => {
    expect(localizeSections(page.sections, page.sectionsKm, "en")).toBe(page.sections)
    expect(localizeSections(page.sections, null, "km")).toBe(page.sections)
    expect(localizeSections(page.sections, [], "km")).toBe(page.sections)
  })
})

describe("localizePage", () => {
  it("translates what exists and keeps English for the rest", () => {
    const result = localizePage(page, "km")
    expect(result.eyebrow).toBe("ច្បាប់")
    expect(result.title).toBe("លក្ខខណ្ឌ")
    expect(result.summary).toBe("Our terms")
  })

  it("leaves the English page as it is", () => {
    expect(localizePage(page, "en").title).toBe("Terms")
  })
})
