import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { AdminListingImage } from "../types"
import { ListingImageAvatars } from "./listing-image-avatars"

const photos = (count: number): AdminListingImage[] =>
  Array.from({ length: count }, (_, index) => ({ id: `img-${index}`, url: `https://cdn.test/${index}.jpg` }))

describe("<ListingImageAvatars />", () => {
  it("shows a single avatar for one photo", () => {
    render(<ListingImageAvatars images={photos(1)} title="Honda Civic" />)

    expect(screen.getByRole("img", { name: "1 photo of Honda Civic" })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="avatar-group"]')).toBeNull()
  })

  it("shows a placeholder avatar when there are no photos", () => {
    render(<ListingImageAvatars images={[]} title="Honda Civic" />)

    expect(screen.getByRole("img", { name: "0 photos of Honda Civic" })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="avatar"]')).toHaveLength(1)
  })

  it("shows overlapping avatars for several photos", () => {
    render(<ListingImageAvatars images={photos(3)} title="Honda Civic" />)

    expect(screen.getByRole("img", { name: "3 photos of Honda Civic" })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="avatar"]')).toHaveLength(3)
    expect(document.querySelector('[data-slot="avatar-group-count"]')).toBeNull()
  })

  it("caps the stack and counts the remaining photos", () => {
    render(<ListingImageAvatars images={photos(7)} title="Honda Civic" />)

    expect(document.querySelectorAll('[data-slot="avatar"]')).toHaveLength(4)
    expect(screen.getByText("+3")).toBeInTheDocument()
  })
})
