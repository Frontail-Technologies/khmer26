import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { SecuritySettings } from "./security-settings"

const mocks = vi.hoisted(() => ({
  methods: vi.fn(),
  sessions: vi.fn(),
  mutation: { isPending: false, variables: undefined, mutate: vi.fn() },
}))

vi.mock("../api/settings.queries", () => ({
  useAuthenticationMethods: mocks.methods,
  useAccountSessions: mocks.sessions,
  useDeleteAccount: () => mocks.mutation,
  useLogoutOtherSessions: () => mocks.mutation,
  useRevokeAccountSession: () => mocks.mutation,
  useChangePassword: () => mocks.mutation,
}))

describe("SecuritySettings", () => {
  beforeEach(() => {
    mocks.sessions.mockReturnValue({ data: [], isLoading: false, isError: false })
  })

  it("hides password controls for Google and Telegram-only accounts", () => {
    mocks.methods.mockReturnValue({
      data: {
        hasPassword: false,
        providers: [
          { id: "google", provider: "google" },
          { id: "telegram", provider: "telegram" },
        ],
      },
      isPending: false,
    })

    renderWithProviders(<SecuritySettings />)

    expect(screen.queryByRole("button", { name: /change password/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /set password/i })).not.toBeInTheDocument()
  })

  it("keeps change password available for password accounts", () => {
    mocks.methods.mockReturnValue({ data: { hasPassword: true, providers: [] }, isPending: false })

    renderWithProviders(<SecuritySettings />)

    expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument()
  })
})
