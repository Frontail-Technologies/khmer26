import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "@/test/test-utils"
import { SystemMessage } from "./system-message"

describe("<SystemMessage />", () => {
  it("shows the English notice to English visitors", () => {
    renderWithProviders(<SystemMessage content="Buyer withdrew the offer." contentKm="អ្នកទិញបានដកការផ្តល់ជូន។" />, { locale: "en" })
    expect(screen.getByText("Buyer withdrew the offer.")).toBeInTheDocument()
  })

  it("shows the Khmer notice to Khmer visitors", () => {
    renderWithProviders(<SystemMessage content="Buyer withdrew the offer." contentKm="អ្នកទិញបានដកការផ្តល់ជូន។" />, { locale: "km" })
    expect(screen.getByText("អ្នកទិញបានដកការផ្តល់ជូន។")).toBeInTheDocument()
  })

  it("falls back to English for messages written before translations existed", () => {
    renderWithProviders(<SystemMessage content="Offer of $25 was accepted." />, { locale: "km" })
    expect(screen.getByText("Offer of $25 was accepted.")).toBeInTheDocument()
  })
})
