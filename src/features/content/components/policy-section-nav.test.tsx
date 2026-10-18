import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PolicySectionNav } from "./policy-section-nav"

const sections = [
  { id: "first", title: "First section" },
  { id: "second", title: "Second section" },
]

describe("PolicySectionNav", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/terms")
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0)
      return 1
    })
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined)
  })

  it("marks a clicked section as the current location", () => {
    renderWithProviders(<PolicySectionNav title="Terms" sections={sections} />)
    const secondLink = screen.getByRole("link", { name: "Second section" })

    fireEvent.click(secondLink)

    expect(secondLink).toHaveAttribute("aria-current", "location")
    expect(screen.getByRole("link", { name: "First section" })).not.toHaveAttribute("aria-current")
  })

  it("updates the current link as the reader scrolls", () => {
    document.body.innerHTML = '<section id="first"></section><section id="second"></section>'
    const first = document.getElementById("first")!
    const second = document.getElementById("second")!
    vi.spyOn(first, "getBoundingClientRect").mockReturnValue({ top: -200 } as DOMRect)
    vi.spyOn(second, "getBoundingClientRect").mockReturnValue({ top: 80 } as DOMRect)

    renderWithProviders(<PolicySectionNav title="Terms" sections={sections} />)
    fireEvent.scroll(window)

    expect(screen.getByRole("link", { name: "Second section" })).toHaveAttribute("aria-current", "location")
  })
})
