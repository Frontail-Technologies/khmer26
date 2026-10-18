import { describe, expect, it } from "vitest"
import { splitLinks } from "./linkify"

describe("splitLinks", () => {
  it("returns plain text untouched", () => {
    expect(splitLinks("Dell PowerEdge R360")).toEqual([{ type: "text", value: "Dell PowerEdge R360" }])
  })

  it("links http(s) addresses and keeps the surrounding text", () => {
    expect(splitLinks("Telegrams: https://t.me/Camboparts today")).toEqual([
      { type: "text", value: "Telegrams: " },
      { type: "link", value: "https://t.me/Camboparts", href: "https://t.me/Camboparts" },
      { type: "text", value: " today" },
    ])
  })

  it("adds https to bare www addresses", () => {
    expect(splitLinks("see www.khmer26.com/shop")).toEqual([
      { type: "text", value: "see " },
      { type: "link", value: "www.khmer26.com/shop", href: "https://www.khmer26.com/shop" },
    ])
  })

  it("leaves trailing punctuation outside the link", () => {
    expect(splitLinks("(https://example.com/a), thanks.")).toEqual([
      { type: "text", value: "(" },
      { type: "link", value: "https://example.com/a", href: "https://example.com/a" },
      { type: "text", value: "), thanks." },
    ])
  })

  it("finds several links", () => {
    const links = splitLinks("https://a.com and https://b.com").filter((part) => part.type === "link")
    expect(links).toHaveLength(2)
  })

  it("never links other schemes", () => {
    const parts = splitLinks("javascript:alert(1) data:text/html,hi ftp://x.com")
    expect(parts.every((part) => part.type === "text")).toBe(true)
  })
})
