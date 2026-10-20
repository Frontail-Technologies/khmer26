import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useIsMobile } from "./use-mobile"

describe("useIsMobile", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("uses the legacy MediaQueryList listener API when required", () => {
    let listener: (() => void) | undefined
    const removeListener = vi.fn()

    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true,
      media: "(max-width: 767px)",
      onchange: null,
      addListener: vi.fn((callback: () => void) => { listener = callback }),
      removeListener,
      dispatchEvent: vi.fn(),
    })))
    Object.defineProperty(window, "innerWidth", { value: 390, configurable: true })

    const { result, unmount } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)

    act(() => listener?.())
    unmount()
    expect(removeListener).toHaveBeenCalledOnce()
  })
})
