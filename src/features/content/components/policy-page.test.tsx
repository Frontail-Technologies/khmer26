import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { PolicyPage } from "./policy-page"

describe("PolicyPage", () => {
  it("renders structured policy content and navigable section anchors", () => {
    renderWithProviders(<PolicyPage page={{
      id: "page-1",
      slug: "posting-rules",
      eyebrow: "Marketplace policy",
      title: "Posting Rules",
      summary: "Rules for marketplace listings.",
      sections: [{
        id: "accurate-listings",
        title: "Accurate listings",
        paragraphs: ["Describe the item accurately."],
        items: ["Use a genuine price."],
      }],
      isPublished: true,
      publishedAt: "2026-10-16T00:00:00.000Z",
      createdAt: "2026-10-16T00:00:00.000Z",
      updatedAt: "2026-10-16T00:00:00.000Z",
    }} />)

    expect(screen.getByRole("heading", { name: "Posting Rules" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Accurate listings" })).toHaveAttribute("href", "#accurate-listings")
    expect(screen.getByText("Use a genuine price.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /contact khmer26/i })).toHaveAttribute("href", "/contact")
  })
})
