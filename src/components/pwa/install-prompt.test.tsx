import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { InstallPrompt, resetInstallPromptSessionForTests } from "./install-prompt"

function promptEvent() {
  const event = new Event("beforeinstallprompt") as Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> }
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome: "dismissed" })
  return event
}

describe("<InstallPrompt />", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetInstallPromptSessionForTests()
    localStorage.clear()
    document.cookie = "k26_install_dismissed=; path=/; max-age=0"
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
  })
  afterEach(() => vi.useRealTimers())

  it("stays closed after the X, even when the browser fires beforeinstallprompt again", () => {
    renderWithProviders(<InstallPrompt />)

    act(() => {
      window.dispatchEvent(promptEvent())
      vi.advanceTimersByTime(20_000)
    })
    fireEvent.click(screen.getByRole("button", { name: /not now/i }))
    expect(screen.queryByRole("dialog")).toBeNull()

    act(() => {
      window.dispatchEvent(promptEvent())
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("remembers the dismissal in a cookie when localStorage is unavailable", () => {
    const { unmount } = renderWithProviders(<InstallPrompt />)
    act(() => {
      window.dispatchEvent(promptEvent())
      vi.advanceTimersByTime(20_000)
    })
    fireEvent.click(screen.getByRole("button", { name: /not now/i }))
    unmount()

    // New page load (fresh module state) with storage wiped/blocked: the cookie alone must hold.
    localStorage.clear()
    expect(document.cookie).toMatch(/k26_install_dismissed=\d+/)
    resetInstallPromptSessionForTests()
    renderWithProviders(<InstallPrompt />)
    act(() => {
      window.dispatchEvent(promptEvent())
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})
