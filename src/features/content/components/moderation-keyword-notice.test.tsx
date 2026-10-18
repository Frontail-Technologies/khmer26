import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { HighlightedModerationText, ModerationKeywordNotice } from "./moderation-keyword-notice"

const matches = [{
  id: "one",
  keywordId: "one",
  keyword: "replica",
  guidance: "Explain whether the item is authentic.",
  field: "title" as const,
}]

describe("moderation keyword seller feedback", () => {
  it("explains that a matched listing can still be submitted", () => {
    renderWithProviders(<ModerationKeywordNotice matches={matches} />)
    expect(screen.getByText(/can still submit/i)).toBeInTheDocument()
    expect(screen.getByText("replica")).toBeInTheDocument()
    expect(screen.getByText(/authentic/i)).toBeInTheDocument()
  })

  it("marks the matched text in a seller preview", () => {
    const { container } = renderWithProviders(
      <p><HighlightedModerationText text="Replica watch" matches={matches} field="title" /></p>
    )
    expect(container.querySelector("mark")).toHaveTextContent("Replica")
  })
})
