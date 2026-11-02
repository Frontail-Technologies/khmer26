import { describe, it, expect, beforeEach } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { ListingViewModeProvider, useListingViewMode } from "./use-listing-view-mode"
import { parseViewMode } from "../lib/view-mode"

function clearCookie() {
  document.cookie = "k26_view=; path=/; max-age=0"
}

describe("useListingViewMode", () => {
  beforeEach(() => {
    clearCookie()
    localStorage.clear()
  })

  it("parses only list/grid", () => {
    expect(parseViewMode("list")).toBe("list")
    expect(parseViewMode("grid")).toBe("grid")
    expect(parseViewMode("weird")).toBe("grid")
    expect(parseViewMode(undefined)).toBe("grid")
  })

  it("stores the choice in a cookie so the server can render it on refresh", () => {
    const { result } = renderHook(() => useListingViewMode())
    act(() => result.current[1]("list"))
    expect(result.current[0]).toBe("list")
    expect(document.cookie).toContain("k26_view=list")
  })

  it("migrates a choice saved before the cookie existed", () => {
    localStorage.setItem("khmer26_listing_view_mode", "list")
    const { result } = renderHook(() => useListingViewMode())
    expect(result.current[0]).toBe("list")
    expect(document.cookie).toContain("k26_view=list")
  })

  it("server-renders the mode from the cookie (no grid flash on refresh)", () => {
    function Probe() {
      const [mode] = useListingViewMode()
      return <span>{mode}</span>
    }
    const html = renderToString(
      <ListingViewModeProvider initialMode="list">
        <Probe />
      </ListingViewModeProvider>
    )
    expect(html).toContain("list")
  })
})
