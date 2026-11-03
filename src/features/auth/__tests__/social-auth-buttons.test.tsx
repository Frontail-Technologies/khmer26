import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"

// Each case re-imports the component (its Google client id is read at module load), which is slow.
vi.setConfig({ testTimeout: 30_000 })

// The icon barrel has thousands of exports and dominates the cold import; the icons are irrelevant here.
vi.mock("@phosphor-icons/react", () => ({ SpinnerGap: () => null }))

vi.mock("../hooks/use-auth", () => ({
  useTelegramAuth: () => ({ mutate: vi.fn(), isPending: false }),
  friendlyAuthError: () => "error",
  resolveNextPath: () => "/account",
}))

const startGoogleRedirect = vi.fn()
vi.mock("../lib/google-redirect", () => ({ startGoogleRedirect }))

async function loadComponent() {
  vi.resetModules()
  return (await import("../components/social-auth-buttons")).SocialAuthButtons
}

const googleButton = () => screen.getByRole("button", { name: /continue with google/i })

beforeEach(() => {
  startGoogleRedirect.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("<SocialAuthButtons /> Google sign-in", () => {
  it("uses our own button and loads no Google script, iframe or overlay", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)

    expect(googleButton()).toBeVisible()
    expect(container.querySelector("iframe, .opacity-0, [data-slot='google-button']")).toBeNull()
    expect(document.querySelector('script[src*="accounts.google.com/gsi/client"]')).toBeNull()
  })

  it("redirects to Google from the button, keeping where to land afterwards", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    window.history.replaceState(null, "", "/login?next=%2Faccount")
    const SocialAuthButtons = await loadComponent()
    renderWithProviders(<SocialAuthButtons />)

    fireEvent.click(googleButton())
    expect(startGoogleRedirect).toHaveBeenCalledWith("test-client-id", "/account")
    window.history.replaceState(null, "", "/")
  })

  it("says so when Google isn't configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "")
    const SocialAuthButtons = await loadComponent()
    renderWithProviders(<SocialAuthButtons />)

    fireEvent.click(googleButton())
    expect(screen.getByText("Google sign-in is not configured.")).toBeInTheDocument()
    expect(startGoogleRedirect).not.toHaveBeenCalled()
  })
})
