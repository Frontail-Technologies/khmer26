import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
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

const googleSlot = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-slot="google-button"]')!
const fallbackButton = () => screen.queryByRole("button", { name: /continue with google/i })

beforeEach(() => {
  // jsdom has no ResizeObserver; the component only needs it to exist.
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} unobserve() {} })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  delete (window as unknown as { google?: GoogleStub }).google
})

describe("<SocialAuthButtons /> Google widget mode", () => {
  it("shows our button as the control when Google isn't configured, with the empty widget slot inert", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "")
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)

    const button = fallbackButton()!
    expect(button).toBeInTheDocument()
    expect(button).not.toHaveAttribute("aria-hidden")
    expect(googleSlot(container)).toHaveAttribute("inert")

    fireEvent.click(button)
    expect(screen.getByText("Google sign-in is not configured.")).toBeInTheDocument()
  })

  it("renders Google's own button visibly and drops our placeholder once Google is ready", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    const stub: GoogleStub = { accounts: { id: { initialize: vi.fn(), renderButton: vi.fn() } } }
    ;(window as unknown as { google: GoogleStub }).google = stub
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)

    await waitFor(() => expect(stub.accounts.id.renderButton).toHaveBeenCalled())
    await waitFor(() => expect(fallbackButton()).toBeNull())

    const slot = googleSlot(container)
    // Visible and interactive: never hidden behind opacity, inert or aria-hidden (the old overlay bug).
    expect(slot.className).not.toContain("opacity-0")
    expect(slot).not.toHaveAttribute("inert")
    expect(slot.closest('[aria-hidden="true"]')).toBeNull()
    const [target, options] = stub.accounts.id.renderButton.mock.calls[0]!
    expect(target).toBe(slot)
    expect(options).toMatchObject({ text: "continue_with", locale: "en" })
    expect(options.width).toBeGreaterThanOrEqual(200)
    expect(options.width).toBeLessThanOrEqual(400)
  })
})
