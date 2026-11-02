import { describe, it, expect, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { ListingGallery } from "../components/detail/listing-gallery"

const images = Array.from({ length: 6 }, (_, i) => ({ url: `https://cdn.test/${i}.jpg`, alt: `Photo ${i}` }))

describe("<ListingGallery /> thumbnail strip", () => {
  it("scrolls the strip (not the page) to the active photo when the main photo changes", () => {
    const scrollTo = vi.fn()
    const pageScroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {})
    Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: scrollTo })

    renderWithProviders(<ListingGallery images={images as never} title="Car" />)
    scrollTo.mockClear()
    fireEvent.click(screen.getAllByRole("button", { name: /next/i })[0]!)

    expect(scrollTo).toHaveBeenCalled()
    expect(pageScroll).not.toHaveBeenCalled()
    pageScroll.mockRestore()
  })
})
