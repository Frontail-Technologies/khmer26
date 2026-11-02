import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"

// Each case re-imports the component (its Google client id is read at module load), which is slow.
vi.setConfig({ testTimeout: 30_000 })

// The icon barrel has thousands of exports and dominates the cold import; the icons are irrelevant here.
vi.mock("@phosphor-icons/react", () => ({ SpinnerGap: () => null }))

const googleMutate = vi.fn()
vi.mock("../hooks/use-auth", () => ({
  useGoogleAuth: () => ({ mutate: googleMutate, isPending: false }),
  useTelegramAuth: () => ({ mutate: vi.fn(), isPending: false }),
  friendlyAuthError: () => "error",
}))

type TokenConfig = {
  client_id: string
  scope: string
  callback: (res: { access_token?: string; error?: string }) => void
  error_callback?: (err: { type: string }) => void
}

async function loadComponent() {
  vi.resetModules()
  return (await import("../components/social-auth-buttons")).SocialAuthButtons
}

const googleButton = () => screen.getByRole("button", { name: /continue with google/i })

/** Installs a fake Google token client and returns hooks to drive it. */
function stubGoogle() {
  let config: TokenConfig | null = null
  const requestAccessToken = vi.fn()
  const initTokenClient = vi.fn((cfg: TokenConfig) => {
    config = cfg
    return { requestAccessToken }
  })
  ;(window as unknown as { google: unknown }).google = { accounts: { oauth2: { initTokenClient } } }
  return { initTokenClient, requestAccessToken, config: () => config! }
}

beforeEach(() => {
  googleMutate.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
  delete (window as unknown as { google?: unknown }).google
})

describe("<SocialAuthButtons /> Google sign-in", () => {
  it("keeps our styled button, with no hidden Google overlay to swallow clicks", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    stubGoogle()
    const SocialAuthButtons = await loadComponent()
    const { container } = renderWithProviders(<SocialAuthButtons />)

    expect(googleButton()).toBeVisible()
    expect(container.querySelector("iframe, .opacity-0, [data-slot='google-button']")).toBeNull()
  })

  it("opens Google's popup from our button and signs in with the access token", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    const google = stubGoogle()
    const SocialAuthButtons = await loadComponent()
    renderWithProviders(<SocialAuthButtons />)

    await waitFor(() => expect(google.initTokenClient).toHaveBeenCalled())
    expect(google.config()).toMatchObject({ client_id: "test-client-id", scope: "openid email profile" })

    fireEvent.click(googleButton())
    expect(google.requestAccessToken).toHaveBeenCalledTimes(1)

    google.config().callback({ access_token: "ya29.token" })
    expect(googleMutate).toHaveBeenCalledWith({ accessToken: "ya29.token" }, expect.anything())
  })

  it("explains a blocked popup, and treats closing the popup as a quiet cancel", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "test-client-id")
    const google = stubGoogle()
    const SocialAuthButtons = await loadComponent()
    renderWithProviders(<SocialAuthButtons />)
    await waitFor(() => expect(google.initTokenClient).toHaveBeenCalled())

    google.config().error_callback?.({ type: "popup_closed" })
    await waitFor(() => expect(screen.queryByText(/blocked the google window/i)).toBeNull())

    google.config().error_callback?.({ type: "popup_failed_to_open" })
    expect(await screen.findByText(/blocked the google window/i)).toBeInTheDocument()
    expect(googleMutate).not.toHaveBeenCalled()
  })

  it("says so when Google isn't configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "")
    const SocialAuthButtons = await loadComponent()
    renderWithProviders(<SocialAuthButtons />)

    fireEvent.click(googleButton())
    expect(screen.getByText("Google sign-in is not configured.")).toBeInTheDocument()
  })
})
