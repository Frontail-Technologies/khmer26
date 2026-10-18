import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { describe, expect, it, vi } from "vitest"
import { AppHeader } from "./AppHeader"

vi.mock("next/navigation", () => ({ usePathname: () => "/" }))
vi.mock("next/image", () => ({ default: () => <div data-testid="site-logo" /> }))
vi.mock("@/features/auth/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ user: { email: "seller@example.com" }, isAuthenticated: true }),
}))
vi.mock("@/features/auth/hooks/use-auth", () => ({
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock("./SearchBar", () => ({ SearchBar: () => <div /> }))
vi.mock("./LanguageSelector", () => ({ LanguageSelector: () => <div /> }))
vi.mock("./ThemeToggle", () => ({ ThemeToggle: () => <div /> }))
vi.mock("@/features/notifications/components/notification-bell", () => ({
  NotificationBell: () => <div />,
}))

describe("AppHeader", () => {
  it("renders account dropdown entries as navigable links", async () => {
    renderWithProviders(<AppHeader />)
    fireEvent.click(screen.getByRole("button", { name: "Account menu" }))

    const profileLink = await screen.findByRole("menuitem", { name: "Profile" })
    expect(profileLink).toHaveAttribute("href", "/account/profile")
  })
})
