import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { closeSignInPrompt, getSignInPromptReturnTo, openSignInPrompt } from "../lib/sign-in-prompt-store"
import { SignInPrompt } from "./sign-in-prompt"

vi.mock("next/navigation", () => ({ usePathname: () => "/" }))

let authenticated = false
vi.mock("../hooks/use-current-user", () => ({
  useCurrentUser: () => ({ isAuthenticated: authenticated, isLoading: false, user: null }),
}))

function protectedLink(onClick = vi.fn()) {
  const a = document.createElement("a")
  a.href = "/messages?tab=all"
  a.textContent = "Messages"
  a.addEventListener("click", onClick)
  document.body.appendChild(a)
  return { a, onClick }
}

describe("<SignInPrompt />", () => {
  beforeEach(() => {
    authenticated = false
    act(() => closeSignInPrompt())
    document.body.innerHTML = ""
  })

  it("opens for guests tapping a protected link instead of navigating, keeping the target as next", () => {
    renderWithProviders(<SignInPrompt />)
    const { a, onClick } = protectedLink()

    fireEvent.click(a)

    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login?next=%2Fmessages%3Ftab%3Dall")
  })

  it("lets signed-in visitors through", () => {
    authenticated = true
    renderWithProviders(<SignInPrompt />)
    const { a, onClick } = protectedLink()

    fireEvent.click(a)

    expect(onClick).toHaveBeenCalled()
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("ignores public links", () => {
    renderWithProviders(<SignInPrompt />)
    const a = document.createElement("a")
    a.href = "/search"
    document.body.appendChild(a)

    fireEvent.click(a)

    expect(getSignInPromptReturnTo()).toBeNull()
  })

  it("closes from Not now", () => {
    renderWithProviders(<SignInPrompt />)
    act(() => openSignInPrompt("/post-ad"))

    fireEvent.click(screen.getByRole("button", { name: /not now/i }))

    expect(getSignInPromptReturnTo()).toBeNull()
  })

  it("rejects off-site return paths", () => {
    act(() => openSignInPrompt("//evil.example"))
    expect(getSignInPromptReturnTo()).toBe("/")
  })
})
