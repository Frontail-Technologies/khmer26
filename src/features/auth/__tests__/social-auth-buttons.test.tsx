import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"

// Each case re-imports the component (its Google client id is read at module load), which is slow.
vi.setConfig({ testTimeout: 30_000 })

// The icon barrel has thousands of exports and dominates the cold import; the icons are irrelevant here.
vi.mock("@phosphor-icons/react", () => ({ SpinnerGap: () => null }))

vi.mock("../hooks/use-auth", () => ({
  useGoogleAuth: () => ({ mutate: vi.fn(), isPending: false }),
  useTelegramAuth: () => ({ mutate: vi.fn(), isPending: false }),
  friendlyAuthError: () => "error",
}))

type GoogleStub = {
  accounts: { id: { initialize: ReturnType<typeof vi.fn>; renderButton: ReturnType<typeof vi.fn> } }
}

async function loadComponent() {
  vi.resetModules()
  return (await import("../components/social-auth-buttons")).SocialAuthButtons
}

const googleSlot = (container: HTMLElement) => container.querySelector<HTMLElement>(".opacity-0")!
const googleButton = () => screen.getByText("Continue with Google").closest("button")!

beforeEach(() => {
  // jsdom has no ResizeObserver; the component only needs it to exist.
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} unobserve() {} })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  delete (window as unknown as { google?: GoogleStub }).google
})

describe("<SocialAuthButtons /> Google control accessibility", () => {
  it("keeps our button as the accessible control when Google isn't available, and the empty overlay inert", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "")
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)

    const button = googleButton()
    expect(button).not.toHaveAttribute("aria-hidden")
    expect(button).not.toHaveAttribute("tabindex")
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument()
    expect(googleSlot(container)).toHaveAttribute("inert")
  })

  it("exposes Google's real button and hides only our decorative skin when Google is ready", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    const stub: GoogleStub = { accounts: { id: { initialize: vi.fn(), renderButton: vi.fn() } } }
    ;(window as unknown as { google: GoogleStub }).google = stub
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)

    const slot = googleSlot(container)
    await waitFor(() => expect(stub.accounts.id.renderButton).toHaveBeenCalled())
    await waitFor(() => expect(googleButton()).toHaveAttribute("aria-hidden", "true"))

    // Our button is a visual skin only: out of the tab order and the accessibility tree.
    expect(googleButton()).toHaveAttribute("tabindex", "-1")
    // Google's real control is reachable and is not inside any aria-hidden ancestor.
    expect(slot).not.toHaveAttribute("inert")
    expect(slot).not.toHaveAttribute("aria-hidden")
    expect(slot.closest('[aria-hidden="true"]')).toBeNull()
    expect(stub.accounts.id.renderButton.mock.calls[0]![0]).toBe(slot)
  })

  it("shows a visible focus ring on the wrapper so the transparent Google button is never an invisible focus stop", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "")
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)
    expect(googleSlot(container).parentElement!.className).toContain("focus-within:ring-2")
  })
})
