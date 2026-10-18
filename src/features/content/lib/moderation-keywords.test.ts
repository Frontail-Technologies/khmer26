import { describe, expect, it } from "vitest"
import { findModerationMatches, normalizeModerationText } from "./moderation-keywords"

const rules = [
  { id: "one", keyword: "advance payment", guidance: "Clarify payment timing." },
  { id: "two", keyword: "Replica", guidance: null },
]

describe("moderation keyword matching", () => {
  it("finds title and description matches without changing submission eligibility", () => {
    expect(findModerationMatches({ title: "Replica watch", description: "ADVANCE   PAYMENT only" }, rules))
      .toMatchObject([
        { keywordId: "one", field: "description" },
        { keywordId: "two", field: "title" },
      ])
  })

  it("normalizes width, case, and whitespace", () => {
    expect(normalizeModerationText("  ＲＥＰＬＩＣＡ\n item ")).toBe("replica item")
  })
})
