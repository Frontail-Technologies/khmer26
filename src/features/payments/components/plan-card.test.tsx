import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { SubscriptionPlan } from "@/features/account/subscription/api/subscription.api"
import { renderWithProviders } from "@/test/test-utils"
import { PlanCard } from "./plan-card"

vi.mock("./subscribe-button", () => ({ SubscribeButton: () => <button type="button">Subscribe</button> }))

const plan: SubscriptionPlan = {
  id: "plan-1",
  name: "Pro",
  nameKm: "ប្រូ",
  slug: "pro",
  description: "For active sellers",
  descriptionKm: "សម្រាប់អ្នកលក់សកម្ម",
  price: "12.99",
  currency: "USD",
  billingInterval: "monthly",
  durationDays: 30,
  maxListings: 30,
  featuredCredits: 3,
  bumpCredits: 6,
  isActive: true,
}

describe("<PlanCard /> languages", () => {
  it("shows the English name and description to English visitors", () => {
    renderWithProviders(<PlanCard plan={plan} />, { locale: "en" })

    expect(screen.getByText("Pro")).toBeInTheDocument()
    expect(screen.getByText("For active sellers")).toBeInTheDocument()
    expect(screen.queryByText("ប្រូ")).not.toBeInTheDocument()
  })

  it("shows the Khmer name and description to Khmer visitors", () => {
    renderWithProviders(<PlanCard plan={plan} />, { locale: "km" })

    expect(screen.getByText("ប្រូ")).toBeInTheDocument()
    expect(screen.getByText("សម្រាប់អ្នកលក់សកម្ម")).toBeInTheDocument()
    expect(screen.queryByText("Pro")).not.toBeInTheDocument()
  })

  it("falls back to English when the plan has no Khmer text", () => {
    renderWithProviders(<PlanCard plan={{ ...plan, nameKm: null, descriptionKm: null }} />, { locale: "km" })

    expect(screen.getByText("Pro")).toBeInTheDocument()
    expect(screen.getByText("For active sellers")).toBeInTheDocument()
  })
})
